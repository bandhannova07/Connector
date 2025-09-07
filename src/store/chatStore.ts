import { create } from 'zustand';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Chat, Message, ChatState } from '../types';
import { 
  encryptMessage, 
 
  encryptWithSymmetricKey, 
  generateSymmetricKey,
  encryptSymmetricKeyForUser
} from '../lib/encryption';

interface ChatStore extends ChatState {
  initializeChats: (userId: string) => void;
  createDirectChat: (userId: string, friendId: string, userPublicKey: string, friendPublicKey: string) => Promise<string>;
  createGroupChat: (userId: string, participantIds: string[], groupName: string, userPublicKey: string, participantPublicKeys: { [userId: string]: string }) => Promise<string>;
  sendMessage: (chatId: string, content: string, messageType: 'text' | 'image' | 'video' | 'voice' | 'file', senderId: string, fileUrl?: string, fileName?: string, fileSize?: number, duration?: number) => Promise<void>;
  setActiveChat: (chat: Chat | null) => void;
  loadMessages: (chatId: string) => void;
  markMessageAsRead: (messageId: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,

  initializeChats: (userId: string) => {
    set({ loading: true });
    
    // Listen to chats where user is a participant
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessage.timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      
      set({ chats, loading: false });
    });

    return unsubscribe;
  },

  createDirectChat: async (userId: string, friendId: string) => {
    try {
      // Check if chat already exists
      const existingChatsQuery = query(
        collection(db, 'chats'),
        where('type', '==', 'direct'),
        where('participants', 'in', [[userId, friendId], [friendId, userId]])
      );
      
      const existingChats = await getDocs(existingChatsQuery);
      
      if (!existingChats.empty) {
        return existingChats.docs[0].id;
      }

      // Create new direct chat
      const chatData: Omit<Chat, 'id'> = {
        type: 'direct',
        participants: [userId, friendId],
        createdAt: serverTimestamp() as any,
        lastMessage: {
          text: '',
          senderId: '',
          timestamp: serverTimestamp() as any,
          messageType: 'text'
        },
        encryptedSymmetricKey: {} // Not used for direct chats
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return chatRef.id;
    } catch (error) {
      console.error('Error creating direct chat:', error);
      throw error;
    }
  },

  createGroupChat: async (userId: string, participantIds: string[], groupName: string, userPublicKey: string, participantPublicKeys: { [userId: string]: string }) => {
    try {
      // Generate symmetric key for group chat
      const symmetricKey = generateSymmetricKey();
      
      // Get user's private key
      const userPrivateKey = localStorage.getItem('decryptedPrivateKey');
      if (!userPrivateKey) {
        throw new Error('User private key not available');
      }

      // Encrypt symmetric key for each participant
      const encryptedSymmetricKey: { [userId: string]: string } = {};
      
      // Encrypt for creator
      encryptedSymmetricKey[userId] = encryptSymmetricKeyForUser(symmetricKey, userPublicKey, userPrivateKey);
      
      // Encrypt for other participants
      for (const participantId of participantIds) {
        if (participantId !== userId && participantPublicKeys[participantId]) {
          encryptedSymmetricKey[participantId] = encryptSymmetricKeyForUser(
            symmetricKey, 
            participantPublicKeys[participantId], 
            userPrivateKey
          );
        }
      }

      const chatData: Omit<Chat, 'id'> = {
        type: 'group',
        participants: [userId, ...participantIds],
        createdAt: serverTimestamp() as any,
        lastMessage: {
          text: '',
          senderId: '',
          timestamp: serverTimestamp() as any,
          messageType: 'text'
        },
        encryptedSymmetricKey,
        groupName,
        adminIds: [userId]
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return chatRef.id;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  },

  sendMessage: async (chatId: string, content: string, messageType: 'text' | 'image' | 'video' | 'voice' | 'file', senderId: string, fileUrl?: string, fileName?: string, fileSize?: number, duration?: number) => {
    try {
      const { chats } = get();
      const chat = chats.find(c => c.id === chatId);
      
      if (!chat) {
        throw new Error('Chat not found');
      }

      const userPrivateKey = localStorage.getItem('decryptedPrivateKey');
      if (!userPrivateKey) {
        throw new Error('User private key not available');
      }

      let encryptedContent: string;

      if (chat.type === 'direct') {
        // For direct chats, use public key encryption
        const recipientId = chat.participants.find(p => p !== senderId);
        if (!recipientId) {
          throw new Error('Recipient not found');
        }

        // Get recipient's public key (you'll need to fetch this from users collection)
        const recipientDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', recipientId)));
        if (recipientDoc.empty) {
          throw new Error('Recipient public key not found');
        }
        
        const recipientPublicKey = recipientDoc.docs[0].data().publicKey;
        encryptedContent = encryptMessage(content, recipientPublicKey, userPrivateKey);
      } else {
        // For group chats, use symmetric key encryption
        const userSymmetricKey = chat.encryptedSymmetricKey[senderId];
        if (!userSymmetricKey) {
          throw new Error('Symmetric key not found for user');
        }

        // Decrypt the symmetric key first
        const { decryptMessage } = await import('../lib/encryption');
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', senderId)));
        const userPublicKey = userDoc.docs[0].data().publicKey;
        
        const symmetricKey = decryptMessage(userSymmetricKey, userPublicKey, userPrivateKey);
        if (!symmetricKey) {
          throw new Error('Failed to decrypt symmetric key');
        }

        encryptedContent = encryptWithSymmetricKey(content, symmetricKey);
      }

      // Create message
      const messageData: Omit<Message, 'id'> = {
        chatId,
        senderId,
        encryptedContent,
        messageType,
        timestamp: serverTimestamp() as any,
        fileUrl,
        fileName,
        fileSize,
        duration,
        readBy: { [senderId]: serverTimestamp() as any }
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update chat's last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: {
          text: messageType === 'text' ? content.substring(0, 50) : `${messageType} message`,
          senderId,
          timestamp: serverTimestamp(),
          messageType
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  setActiveChat: (chat: Chat | null) => {
    set({ activeChat: chat });
    if (chat) {
      get().loadMessages(chat.id);
    }
  },

  loadMessages: (chatId: string) => {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: messages
        }
      }));
    });

    return unsubscribe;
  },

  markMessageAsRead: async (messageId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        [`readBy.${userId}`]: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  },
}));
