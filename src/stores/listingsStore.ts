import { create } from 'zustand';

export type Listing = {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  condition: string;
  seller: string;
  sellerId: number;
  college: string;
  year: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  escrow: boolean;
  wishlist: boolean;
  category: string;
  description: string;
  status?: 'active' | 'sold' | 'removed' | 'pending';
  createdAt: Date;
  views?: number;
  wishlists?: number;
  transactions?: number;
  responseTime?: number; // in seconds
  memberSince?: Date;
};

export type EscrowState = 'NONE' | 'INITIATED' | 'ESCROW_HOLD' | 'DELIVERED' | 'RELEASED';

interface ListingsState {
  listings: Listing[];
  escrowStates: Record<number, EscrowState>;
  setListings: (listings: Listing[]) => void;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
  setEscrowState: (listingId: number, state: EscrowState) => void;
  getListingById: (id: number) => Listing | undefined;
  incrementViews: (id: number) => void;
}

const initialListings: Listing[] = [
  {
    id: 1,
    title: "Engineering Drawing Kit",
    price: 450,
    originalPrice: 800,
    condition: "Like New",
    seller: "Rahul S.",
    sellerId: 101,
    college: "IIT Delhi",
    year: "2nd Year",
    rating: 4.9,
    reviews: 23,
    image: "📐",
    verified: true,
    escrow: true,
    wishlist: false,
    category: "other",
    description: "Complete engineering drawing kit with all instruments in excellent condition.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 45,
    wishlists: 3,
    transactions: 8,
    responseTime: 1200, // 20 minutes in seconds
    memberSince: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
  },
  {
    id: 2,
    title: "MacBook Air M1 2020",
    price: 55000,
    originalPrice: 92900,
    condition: "Good",
    seller: "Priya M.",
    sellerId: 102,
    college: "IIT Delhi",
    year: "4th Year",
    rating: 5.0,
    reviews: 12,
    image: "💻",
    verified: true,
    escrow: true,
    wishlist: true,
    category: "electronics",
    description: "Selling my MacBook Air M1 as I'm upgrading to the new M3 model. Battery health at 92%. Comes with original charger and box.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views: 128,
    wishlists: 7,
    transactions: 3,
    responseTime: 600, // 10 minutes
    memberSince: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 8 months ago
  },
  {
    id: 3,
    title: "MTB Cycle - Firefox",
    price: 8500,
    originalPrice: 18000,
    condition: "Good",
    seller: "Amit K.",
    sellerId: 103,
    college: "IIT Delhi",
    year: "3rd Year",
    rating: 4.7,
    reviews: 8,
    image: "🚲",
    verified: true,
    escrow: true,
    wishlist: false,
    category: "cycles",
    description: "Well-maintained Firefox MTB. Great for campus commute and weekend rides.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views: 67,
    wishlists: 4,
    transactions: 2,
    responseTime: 1800, // 30 minutes
    memberSince: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
  },
  {
    id: 4,
    title: "JEE Advanced Study Material",
    price: 1200,
    originalPrice: 5000,
    condition: "Good",
    seller: "Sneha R.",
    sellerId: 104,
    college: "IIT Delhi",
    year: "1st Year",
    rating: 4.8,
    reviews: 31,
    image: "📖",
    verified: true,
    escrow: true,
    wishlist: false,
    category: "books",
    description: "Complete JEE Advanced preparation material including Physics, Chemistry, and Maths.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 234,
    wishlists: 12,
    transactions: 15,
    responseTime: 300, // 5 minutes
    memberSince: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
  },
  {
    id: 5,
    title: "Study Table with Chair",
    price: 3500,
    originalPrice: 8000,
    condition: "Like New",
    seller: "Vikram P.",
    sellerId: 105,
    college: "IIT Delhi",
    year: "Final Year",
    rating: 4.6,
    reviews: 5,
    image: "🪑",
    verified: true,
    escrow: true,
    wishlist: false,
    category: "furniture",
    description: "Ergonomic study table with comfortable chair. Perfect for long study sessions.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    views: 89,
    wishlists: 5,
    transactions: 1,
    responseTime: 2400, // 40 minutes
    memberSince: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
  },
  {
    id: 6,
    title: "Acoustic Guitar - Yamaha",
    price: 6000,
    originalPrice: 12000,
    condition: "Excellent",
    seller: "Arjun N.",
    sellerId: 106,
    college: "IIT Delhi",
    year: "2nd Year",
    rating: 5.0,
    reviews: 15,
    image: "🎸",
    verified: true,
    escrow: true,
    wishlist: true,
    category: "instruments",
    description: "Yamaha F310 acoustic guitar in excellent condition. Great sound quality.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    views: 52,
    wishlists: 2,
    transactions: 4,
    responseTime: 900, // 15 minutes
    memberSince: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
  },
];

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: initialListings,
  escrowStates: {},
  
  setListings: (listings) => set({ listings }),
  
  addListing: (listing) => set((state) => ({
    listings: [
      {
        ...listing,
        id: Math.max(...state.listings.map(l => l.id), 0) + 1,
        createdAt: new Date(),
      },
      ...state.listings,
    ],
  })),
  
  setEscrowState: (listingId, escrowState) => set((state) => ({
    escrowStates: { ...state.escrowStates, [listingId]: escrowState },
  })),
  
  getListingById: (id) => get().listings.find(l => l.id === id),
  
  incrementViews: (listingId) => set((state) => ({
    listings: state.listings.map(l =>
      l.id === listingId ? { ...l, views: (l.views || 0) + 1 } : l
    ),
  })),
  
  incrementWishlists: (listingId) => set((state) => ({
    listings: state.listings.map(l =>
      l.id === listingId ? { ...l, wishlists: (l.wishlists || 0) + 1 } : l
    ),
  })),
  
  decrementWishlists: (listingId) => set((state) => ({
    listings: state.listings.map(l =>
      l.id === listingId && l.wishlists ? { ...l, wishlists: l.wishlists - 1 } : l
    ),
  })),
  
  incrementTransactions: (listingId) => set((state) => ({
    listings: state.listings.map(l =>
      l.id === listingId ? { ...l, transactions: (l.transactions || 0) + 1 } : l
    ),
  })),
  
  updateResponseTime: (listingId, seconds: number) => set((state) => ({
    listings: state.listings.map(l =>
      l.id === listingId 
        ? { 
            ...l, 
            responseTime: l.responseTime 
              ? Math.min(l.responseTime, seconds)
              : seconds 
          }
        : l
    ),
  })),
}));
