import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { CryptoService } from '../utils/simpleCrypto';
import type { Chat, Message, ContactRequest, User } from '../types';

export class ChatService {
  private cryptoService = CryptoService.getInstance();
  private unsubscribers: (() => void)[] = [];

  async sendContactRequest(toUserId: string, message?: string): Promise<void> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    // Check if request already exists
    const existingQuery = query(
      collection(db, 'contactRequests'),
      where('fromUid', '==', user.uid),
      where('toUid', '==', toUserId),
      where('status', 'in', ['pending', 'accepted'])
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      throw new Error('Contact request already exists');
    }

    const requestData = {
      fromUid: user.uid,
      toUid: toUserId,
      status: 'pending',
      message: message || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, 'contactRequests'), requestData);
  }

  async respondToContactRequest(requestId: string, accept: boolean): Promise<void> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    const requestRef = doc(db, 'contactRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      throw new Error('Contact request not found');
    }

    const requestData = requestDoc.data() as ContactRequest;
    const status = accept ? 'accepted' : 'rejected';

    await updateDoc(requestRef, {
      status,
      updatedAt: serverTimestamp()
    });

    // If accepted, create a chat
    if (accept) {
      await this.createDirectChat([requestData.fromUid, requestData.toUid]);
    }
  }

  async createDirectChat(memberIds: string[]): Promise<string> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    // Check if chat already exists
    const existingQuery = query(
      collection(db, 'chats'),
      where('members', 'array-contains', user.uid),
      where('isGroup', '==', false)
    );
    
    const existingChats = await getDocs(existingQuery);
    const existingChat = existingChats.docs.find(doc => {
      const data = doc.data();
      return data.members.length === 2 && 
             memberIds.every(id => data.members.includes(id));
    });

    if (existingChat) {
      return existingChat.id;
    }

    const chatData = {
      members: memberIds,
      isGroup: false,
      admins: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageText: '',
      lastMessageAt: serverTimestamp()
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  }

  async createGroupChat(name: string, memberIds: string[]): Promise<string> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    const chatData = {
      members: [user.uid, ...memberIds],
      isGroup: true,
      name,
      createdBy: user.uid,
      admins: [user.uid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageText: '',
      lastMessageAt: serverTimestamp()
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  }

  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<void> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    // Get chat members to encrypt for each
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (!chatDoc.exists()) {
      throw new Error('Chat not found');
    }

    const chatData = chatDoc.data() as Chat;
    const otherMembers = chatData.members.filter(id => id !== user.uid);

    // Get recipient public keys
    const recipientKeys: Record<string, string> = {};
    for (const memberId of otherMembers) {
      const userDoc = await getDoc(doc(db, 'users', memberId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        recipientKeys[memberId] = userData.pubBoxKey;
      }
    }

    // Encrypt message for each recipient
    const encryptedContent: Record<string, { ciphertext: string; nonce: string }> = {};
    for (const [memberId, pubKey] of Object.entries(recipientKeys)) {
      const encrypted = this.cryptoService.encryptMessage(content, pubKey);
      encryptedContent[memberId] = encrypted;
    }

    const messageData = {
      senderId: user.uid,
      ciphertext: JSON.stringify(encryptedContent),
      nonce: '', // Not used for multi-recipient
      type,
      reactions: {},
      deletedFor: [],
      createdAt: serverTimestamp(),
      seen: [user.uid]
    };

    // Add message to chat
    await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);

    // Update chat last message
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessageText: type === 'text' ? content.substring(0, 100) : `[${type}]`,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  loadUserChats(userId: string): void {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('members', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chats: Chat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastMessageAt: doc.data().lastMessageAt?.toDate() || new Date()
      })) as Chat[];

      useChatStore.getState().setChats(chats);
    });

    this.unsubscribers.push(unsubscribe);
  }

  loadChatMessages(chatId: string): void {
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        let decryptedContent = '';
        
        try {
          // Try to decrypt message
          const { user } = useAuthStore.getState();
          if (user && data.senderId !== user.uid) {
            const encryptedData = JSON.parse(data.ciphertext);
            if (encryptedData[user.uid]) {
              decryptedContent = this.cryptoService.decryptMessage(
                encryptedData[user.uid].ciphertext,
                encryptedData[user.uid].nonce,
                data.senderPubKey || ''
              );
            }
          } else if (user && data.senderId === user.uid) {
            // For own messages, we might store them differently
            decryptedContent = data.originalContent || '[Encrypted]';
          }
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          decryptedContent = '[Failed to decrypt]';
        }

        return {
          id: doc.id,
          senderId: data.senderId,
          ciphertext: data.ciphertext,
          nonce: data.nonce || '',
          type: data.type || 'text',
          signature: data.signature || '',
          senderPubKey: data.senderPubKey || '',
          originalContent: data.originalContent || '',
          decryptedContent,
          createdAt: data.createdAt?.toDate() || new Date(),
          editedAt: data.editedAt?.toDate(),
          seenBy: data.seenBy || {},
          reactions: data.reactions || {},
          deletedFor: data.deletedFor || [],
          seen: data.seen || false
        } as Message;
      });

      useChatStore.getState().setMessages(chatId, messages);
    });

    this.unsubscribers.push(unsubscribe);
  }

  loadContactRequests(userId: string): void {
    const requestsQuery = query(
      collection(db, 'contactRequests'),
      where('toUid', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requests: ContactRequest[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ContactRequest[];

      useChatStore.getState().setContactRequests(requests);
    });

    this.unsubscribers.push(unsubscribe);
  }

  cleanup(): void {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
  }
}
