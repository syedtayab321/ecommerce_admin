import { db } from './../../firebase/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  writeBatch,
  getDocs,
  increment // Added increment
} from 'firebase/firestore';

// Helper function to get conversation ID between two users
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// Check or create conversation between two users
export const getOrCreateConversation = async (currentUserId, otherUserId) => {
  const conversationId = getConversationId(currentUserId, otherUserId);
  const conversationRef = doc(db, 'conversations', conversationId);
  
  try {
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        participants: [currentUserId, otherUserId],
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: {
          [currentUserId]: 0,
          [otherUserId]: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return conversationId;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    throw error;
  }
};

// Send a new message
export const sendMessageService = async (conversationId, senderId, text) => { // Renamed to sendMessageService
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const conversationRef = doc(db, 'conversations', conversationId);
    
    // Add new message
    const messageDoc = await addDoc(messagesRef, {
      senderId,
      text,
      type: 'text',
      status: 'sent',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      read: false,
      deletedFor: []
    });
    
    // Update conversation last message
    await updateDoc(conversationRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
      [`unreadCount.${senderId}`]: 0, // reset for sender
      [`unreadCount.${getOtherParticipant(conversationId, senderId)}`]: increment(1) // Fixed using increment
    });
    
    return messageDoc.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get other participant in conversation
const getOtherParticipant = (conversationId, currentUserId) => {
  const participants = conversationId.split('_');
  return participants.find(id => id !== currentUserId);
};

// Mark messages as read
export const markMessagesAsReadService = async (conversationId, userId) => { // Renamed to markMessagesAsReadService
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    
    // Get all unread messages
    const q = query(
      messagesRef,
      where('read', '==', false),
      where('senderId', '!=', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    // Update conversation unread count
    batch.update(conversationRef, {
      [`unreadCount.${userId}`]: 0,
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Delete message (soft delete)
export const deleteMessageService = async (conversationId, messageId, userId) => { // Renamed to deleteMessageService
  try {
    const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(messageRef, {
      deletedFor: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Get all conversations for a user
export const getUserConversations = (userId, callback) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const conversations = [];
    snapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() });
    });
    callback(conversations);
  });
};

// Get messages for a conversation
export const getConversationMessages = (conversationId, userId, callback) => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(
    messagesRef,
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      const message = doc.data();
      // Only include messages not deleted by current user
      if (!message.deletedFor || !message.deletedFor.includes(userId)) {
        messages.push({ id: doc.id, ...message });
      }
    });
    callback(messages);
    
    // Mark messages as read when loaded
    markMessagesAsReadService(conversationId, userId).catch(console.error); // Updated to use renamed service
  });
};