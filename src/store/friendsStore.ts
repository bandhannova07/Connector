import { create } from 'zustand';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  or,
  and
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User, FriendRequest, FriendsState } from '../types';

interface FriendsStore extends FriendsState {
  initializeFriends: (userId: string) => () => void;
  searchUsers: (searchTerm: string, currentUserId: string) => Promise<User[]>;
  sendFriendRequest: (fromUserId: string, toUserId: string) => Promise<void>;
  respondToFriendRequest: (requestId: string, response: 'accepted' | 'rejected', userId1: string, userId2: string) => Promise<void>;
  loadFriendRequests: (userId: string) => () => void;
}

export const useFriendsStore = create<FriendsStore>((set) => ({
  friends: [],
  friendRequests: [],
  loading: false,

  initializeFriends: (userId: string) => {
    set({ loading: true });
    
    // Listen to friendships where user is involved
    const friendshipsQuery = query(
      collection(db, 'friends'),
      or(
        where('userId1', '==', userId),
        where('userId2', '==', userId)
      )
    );

    const unsubscribe = onSnapshot(friendshipsQuery, async (snapshot) => {
      const friendships = snapshot.docs.map(doc => doc.data());
      
      // Get friend user IDs
      const friendIds = friendships.map(friendship => 
        friendship.userId1 === userId ? friendship.userId2 : friendship.userId1
      );

      if (friendIds.length > 0) {
        // Fetch friend user data
        const usersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', friendIds)
        );
        
        const usersSnapshot = await getDocs(usersQuery);
        const friends = usersSnapshot.docs.map(doc => doc.data()) as User[];
        
        set({ friends, loading: false });
      } else {
        set({ friends: [], loading: false });
      }
    });

    return unsubscribe;
  },

  searchUsers: async (searchTerm: string, currentUserId: string) => {
    try {
      if (!searchTerm.trim()) return [];

      // Search by email or display name
      const usersRef = collection(db, 'users');
      
      // Note: Firestore doesn't support case-insensitive search or partial matches well
      // In a production app, you'd want to use Algolia or similar for better search
      const emailQuery = query(usersRef, where('email', '>=', searchTerm), where('email', '<=', searchTerm + '\uf8ff'));
      const nameQuery = query(usersRef, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));
      
      const [emailResults, nameResults] = await Promise.all([
        getDocs(emailQuery),
        getDocs(nameQuery)
      ]);

      const users = new Map<string, User>();
      
      emailResults.docs.forEach(doc => {
        const userData = doc.data() as User;
        if (userData.uid !== currentUserId) {
          users.set(userData.uid, userData);
        }
      });
      
      nameResults.docs.forEach(doc => {
        const userData = doc.data() as User;
        if (userData.uid !== currentUserId) {
          users.set(userData.uid, userData);
        }
      });

      return Array.from(users.values());
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  sendFriendRequest: async (fromUserId: string, toUserId: string) => {
    try {
      // Check if request already exists
      const existingRequestQuery = query(
        collection(db, 'friendRequests'),
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId),
        where('status', '==', 'pending')
      );
      
      const existingRequests = await getDocs(existingRequestQuery);
      
      if (!existingRequests.empty) {
        throw new Error('Friend request already sent');
      }

      // Check if they're already friends
      const friendshipQuery = query(
        collection(db, 'friends'),
        or(
          and(where('userId1', '==', fromUserId), where('userId2', '==', toUserId)),
          and(where('userId1', '==', toUserId), where('userId2', '==', fromUserId))
        )
      );
      
      const friendships = await getDocs(friendshipQuery);
      
      if (!friendships.empty) {
        throw new Error('Already friends');
      }

      const requestData: Omit<FriendRequest, 'id'> = {
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      await addDoc(collection(db, 'friendRequests'), requestData);
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  respondToFriendRequest: async (requestId: string, response: 'accepted' | 'rejected', userId1: string, userId2: string) => {
    try {
      // Update friend request status
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: response,
        updatedAt: serverTimestamp()
      });

      if (response === 'accepted') {
        // Create friendship
        const friendshipData = {
          userId1,
          userId2,
          createdAt: serverTimestamp(),
          chatId: '' // Will be set when first message is sent
        };

        await addDoc(collection(db, 'friends'), friendshipData);
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      throw error;
    }
  },

  loadFriendRequests: (userId: string) => {
    // Listen to incoming friend requests
    const requestsQuery = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const friendRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FriendRequest[];
      
      set({ friendRequests });
    });

    return unsubscribe;
  },
}));
