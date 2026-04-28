import { create } from 'zustand';

export type Message = {
  id: number;
  sender: 'user' | 'seller' | 'ai';
  content: string;
  timestamp: string;
  image?: string;
};

interface ChatState {
  conversations: Record<number, Message[]>;
  addMessage: (listingId: number, message: Omit<Message, 'id'>) => void;
  getConversation: (listingId: number) => Message[];
}

const getDefaultMessages = (listingId: number): Message[] => [
  {
    id: 1,
    sender: 'seller',
    content: "Hi! Thanks for your interest. It's in great condition. Any questions?",
    timestamp: '10:30 AM',
  },
];

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {},
  
  addMessage: (listingId, message) => set((state) => {
    const existing = state.conversations[listingId] || getDefaultMessages(listingId);
    return {
      conversations: {
        ...state.conversations,
        [listingId]: [
          ...existing,
          { ...message, id: existing.length + 1 },
        ],
      },
    };
  }),
  
  getConversation: (listingId) => {
    const state = get();
    return state.conversations[listingId] || getDefaultMessages(listingId);
  },
}));
