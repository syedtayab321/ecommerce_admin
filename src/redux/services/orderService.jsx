import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './../../firebase/firebase';

// Fetch all orders with optional filters
export const fetchOrders = async (filters = {}) => {
  try {
    let q = collection(db, 'orders');
    
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let startDate;
      switch(filters.dateFilter) {
        case 'today':
          startDate = today;
          break;
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - today.getDay()));
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        default:
          break;
      }
      
      if (startDate) {
        q = query(q, where('createdAt', '>=', startDate));
      }
    }
    
    if (filters.searchTerm) {
      q = query(
        q,
        where('customer.name', '>=', filters.searchTerm),
        where('customer.name', '<=', filters.searchTerm + '\uf8ff')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status and optionally apply discount
export const updateOrderStatus = async (orderId, status, { discount = 0, notes = '' } = {}) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      status,
      discount,
      notes,
      updatedAt: serverTimestamp()
    });
    
    return { id: orderId, status, discount, notes };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Confirm order and update product quantities
export const confirmOrder = async (orderId, { discount = 0, notes = '' }, orderItems) => {
  try {
    const batch = writeBatch(db);
    const orderRef = doc(db, 'orders', orderId);
    
    // Update order status
    batch.update(orderRef, {
      status: 'accepted',
      discount,
      notes,
      updatedAt: serverTimestamp()
    });
    
    // Update product quantities
    orderItems.forEach(item => {
      const productRef = doc(db, 'products', item.productId);
      batch.update(productRef, {
        stock: increment(-item.quantity),
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return { id: orderId, status: 'accepted', discount, notes };
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return orderId;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};