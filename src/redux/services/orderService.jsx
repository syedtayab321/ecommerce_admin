import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './../../firebase/firebase';

export const fetchOrders = async (filters = {}) => {
  try {
    let q = collection(db, 'orders');
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    // Date filter
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
        q = query(q, where('orderDate', '>=', startDate));
      }
    }
    
    // Search filter
    if (filters.searchTerm) {
      q = query(
        q,
        where('userId', '>=', filters.searchTerm),
        where('userId', '<=', filters.searchTerm + '\uf8ff')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Convert Firestore Timestamp to Date if needed
      orderDate: doc.data().orderDate?.toDate() || doc.data().orderDate
    }));
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders. Please try again.');
  }
};

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
    throw new Error('Failed to update order status. Please try again.');
  }
};

export const confirmOrder = async (orderId, { discount = 0, notes = '' }, orderItems) => {
  try {
    const batch = writeBatch(db);
    const orderRef = doc(db, 'orders', orderId);
    
    // Validate items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    // Update order status
    batch.update(orderRef, {
      status: 'accepted',
      discount,
      notes,
      updatedAt: serverTimestamp()
    });
    
    // Update product quantities
    for (const item of orderItems) {
      if (!item.productId) {
        throw new Error('All items must have a productId');
      }
      
      const productRef = doc(db, 'products', item.productId);
      batch.update(productRef, {
        stock: increment(-item.quantity),
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    return { id: orderId, status: 'accepted', discount, notes };
  } catch (error) {
    console.error('Error confirming order:', error);
    throw new Error(error.message || 'Failed to confirm order. Please try again.');
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return orderId;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order. Please try again.');
  }
};