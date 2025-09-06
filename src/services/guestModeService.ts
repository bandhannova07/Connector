// Guest Mode Service - Provides demo data when authentication is disabled
import type { Chat, Message, ContactRequest } from '../types';

export class GuestModeService {
  private static instance: GuestModeService;

  static getInstance(): GuestModeService {
    if (!GuestModeService.instance) {
      GuestModeService.instance = new GuestModeService();
    }
    return GuestModeService.instance;
  }

  // Demo chats for guest mode
  getDemoChats(): Chat[] {
    return [
      {
        id: 'demo-chat-1',
        members: ['guest-user-123', 'demo-friend-1'],
        isGroup: false,
        name: 'Demo Friend',
        avatar: undefined,
        lastMessage: 'Hey! How are you doing?',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        lastMessageText: 'Hey! How are you doing?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        createdBy: 'demo-friend-1',
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        admins: []
      },
      {
        id: 'demo-chat-2',
        members: ['guest-user-123', 'demo-friend-2', 'demo-friend-3'],
        isGroup: true,
        name: 'Demo Group Chat',
        avatar: undefined,
        lastMessage: 'Welcome to the demo group!',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        lastMessageText: 'Welcome to the demo group!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        createdBy: 'guest-user-123',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
        admins: ['guest-user-123']
      }
    ];
  }

  // Demo messages for a chat
  getDemoMessages(chatId: string): Message[] {
    if (chatId === 'demo-chat-1') {
      return [
        {
          id: 'msg-1',
          chatId: 'demo-chat-1',
          senderId: 'demo-friend-1',
          ciphertext: 'Hey! How are you doing?', // In real app, this would be encrypted
          nonce: 'demo-nonce-1',
          type: 'text',
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          seen: {
            'guest-user-123': true,
            'demo-friend-1': true
          },
          reactions: {},
          deletedFor: []
        },
        {
          id: 'msg-2',
          chatId: 'demo-chat-1',
          senderId: 'guest-user-123',
          ciphertext: 'I\'m doing great! Thanks for asking.',
          nonce: 'demo-nonce-2',
          type: 'text',
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          seen: {
            'guest-user-123': true,
            'demo-friend-1': false
          },
          reactions: {},
          deletedFor: []
        }
      ];
    }

    if (chatId === 'demo-chat-2') {
      return [
        {
          id: 'msg-3',
          chatId: 'demo-chat-2',
          senderId: 'guest-user-123',
          ciphertext: 'Welcome to the demo group!',
          nonce: 'demo-nonce-3',
          type: 'text',
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          seen: {
            'guest-user-123': true,
            'demo-friend-2': true,
            'demo-friend-3': false
          },
          reactions: {
            '👍': ['demo-friend-2']
          },
          deletedFor: []
        }
      ];
    }

    return [];
  }

  // Demo contact requests
  getDemoContactRequests(): ContactRequest[] {
    return [
      {
        id: 'req-1',
        fromUid: 'demo-user-pending',
        toUid: 'guest-user-123',
        status: 'pending',
        message: 'Hi! I\'d like to connect with you.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    ];
  }

  // Demo users for search
  getDemoUsers() {
    return [
      {
        uid: 'demo-friend-1',
        username: 'demo_friend_1',
        displayName: 'Demo Friend 1',
        photoURL: undefined,
        about: 'This is a demo friend for testing'
      },
      {
        uid: 'demo-friend-2',
        username: 'demo_friend_2',
        displayName: 'Demo Friend 2',
        photoURL: undefined,
        about: 'Another demo friend'
      },
      {
        uid: 'demo-user-pending',
        username: 'pending_user',
        displayName: 'Pending User',
        photoURL: undefined,
        about: 'A user who sent a contact request'
      }
    ];
  }
}
