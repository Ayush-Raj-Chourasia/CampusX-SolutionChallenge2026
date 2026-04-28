import { create } from 'zustand';

export type ChatUser = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  listingId: number;
  listingTitle: string;
  listingPrice: number;
  lastMessageTime: Date;
};

interface MessagingState {
  chats: ChatUser[];
  addOrUpdateChat: (chat: ChatUser) => void;
  markAsRead: (chatId: string) => void;
  getChatsWithUnread: () => ChatUser[];
  getUnreadCount: () => number;
  moveToTop: (chatId: string, newMessage: string, timestamp: string) => void;
  deleteChat: (chatId: string) => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  chats: [],

  addOrUpdateChat: (chat) =>
    set((state) => {
      const existing = state.chats.find((c) => c.id === chat.id);
      if (existing) {
        return {
          chats: state.chats.map((c) =>
            c.id === chat.id ? { ...c, ...chat } : c
          ),
        };
      }
      return { chats: [...state.chats, chat] };
    }),

  moveToTop: (chatId, newMessage, timestamp) =>
    set((state) => {
      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return state;

      const updated = {
        ...chat,
        lastMessage: newMessage,
        timestamp,
        lastMessageTime: new Date(),
        unread: chat.unread + 1,
      };

      const filtered = state.chats.filter((c) => c.id !== chatId);
      return { chats: [updated, ...filtered] };
    }),

  markAsRead: (chatId) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, unread: 0 } : c
      ),
    })),

  getChatsWithUnread: () => {
    const state = get();
    return state.chats.sort(
      (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    );
  },

  getUnreadCount: () => {
    const state = get();
    return state.chats.reduce((sum, chat) => sum + chat.unread, 0);
  },

  deleteChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
    })),
}));
