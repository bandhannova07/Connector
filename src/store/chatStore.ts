import { create } from 'zustand';
import type { Chat, Message, ContactRequest } from '../types';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Record<string, Message[]>;
  contactRequests: ContactRequest[];
  unreadCounts: Record<string, number>;
  typingUsers: Record<string, string[]>;
  
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  setCurrentChat: (chat: Chat | null) => void;
  
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  
  setContactRequests: (requests: ContactRequest[]) => void;
  addContactRequest: (request: ContactRequest) => void;
  updateContactRequest: (requestId: string, updates: Partial<ContactRequest>) => void;
  
  setUnreadCount: (chatId: string, count: number) => void;
  incrementUnreadCount: (chatId: string) => void;
  clearUnreadCount: (chatId: string) => void;
  
  setTypingUsers: (chatId: string, users: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  messages: {},
  contactRequests: [],
  unreadCounts: {},
  typingUsers: {},
  
  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({
    chats: [...state.chats, chat]
  })),
  
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
    currentChat: state.currentChat?.id === chatId 
      ? { ...state.currentChat, ...updates } 
      : state.currentChat
  })),
  
  setCurrentChat: (chat) => set({ currentChat: chat }),
  
  setMessages: (chatId, messages) => set((state) => ({
    messages: { ...state.messages, [chatId]: messages }
  })),
  
  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message]
    }
  })),
  
  updateMessage: (chatId, messageId, updates) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: (state.messages[chatId] || []).map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    }
  })),
  
  setContactRequests: (requests) => set({ contactRequests: requests }),
  
  addContactRequest: (request) => set((state) => ({
    contactRequests: [...state.contactRequests, request]
  })),
  
  updateContactRequest: (requestId, updates) => set((state) => ({
    contactRequests: state.contactRequests.map(req =>
      req.id === requestId ? { ...req, ...updates } : req
    )
  })),
  
  setUnreadCount: (chatId, count) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [chatId]: count }
  })),
  
  incrementUnreadCount: (chatId) => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      [chatId]: (state.unreadCounts[chatId] || 0) + 1
    }
  })),
  
  clearUnreadCount: (chatId) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [chatId]: 0 }
  })),
  
  setTypingUsers: (chatId, users) => set((state) => ({
    typingUsers: { ...state.typingUsers, [chatId]: users }
  }))
}));
