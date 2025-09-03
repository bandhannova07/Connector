export interface User {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
  about?: string;
  pubBoxKey: string;
  pubSignKey: string;
  keyBackup?: string;
  devices: Record<string, Device>;
  status: 'online' | 'offline' | 'busy' | 'invisible';
  phoneNumber?: string;
  settings: UserSettings;
  lastSeen: Date;
  createdAt: Date;
}

export interface Device {
  deviceName: string;
  pubKey: string;
  lastActive: Date;
}

export interface UserSettings {
  notifications: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string;
}

export interface HandleReservation {
  uid: string;
  reserved: boolean;
}

export interface ContactRequest {
  id: string;
  fromUid: string;
  toUid: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  members: string[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
  createdBy?: string;
  admins: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageText: string;
  lastMessageAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  ciphertext: string;
  nonce: string;
  type: 'text' | 'image' | 'file' | 'system' | 'call';
  mediaURL?: string;
  replyTo?: string;
  reactions: Record<string, string>;
  deletedFor: string[];
  editedAt?: Date;
  createdAt: Date;
  seen: string[];
}

export interface EncryptedKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export interface KeyPair {
  boxKeys: EncryptedKeyPair;
  signKeys: EncryptedKeyPair;
}

export interface EncryptedMessage {
  ciphertext: string;
  nonce: string;
}
