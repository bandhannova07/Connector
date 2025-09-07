import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp;
  lastSeen: Timestamp;
  isOnline: boolean;
  publicKey: string;
  encryptedPrivateKey: string;
  fcmToken: string | null;
  passkeyEnabled: boolean;
  passkeyCredentialId: string | null;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Friendship {
  id: string;
  userId1: string;
  userId2: string;
  createdAt: Timestamp;
  chatId: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  createdAt: Timestamp;
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
    messageType: 'text' | 'image' | 'video' | 'voice' | 'file';
  };
  encryptedSymmetricKey: { [userId: string]: string };
  groupName?: string;
  groupPhoto?: string;
  adminIds?: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  encryptedContent: string;
  messageType: 'text' | 'image' | 'video' | 'voice' | 'file';
  timestamp: Timestamp;
  editedAt?: Timestamp;
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  readBy: { [userId: string]: Timestamp };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'friendRequest' | 'groupInvite';
  title: string;
  body: string;
  data: object;
  read: boolean;
  createdAt: Timestamp;
}

export interface AdminFeedback {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: Timestamp;
  adminResponse?: string;
  respondedAt?: Timestamp;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  loading: boolean;
}

export interface FriendsState {
  friends: User[];
  friendRequests: FriendRequest[];
  loading: boolean;
}
