import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './../../firebase/firebase';

export const fetchCustomers = async (filters = {}) => {
  try {
    let q = collection(db, 'customers');
    
    if (filters.searchTerm) {
      q = query(
        q,
        where('email', '>=', filters.searchTerm),
        where('email', '<=', filters.searchTerm + '\uf8ff')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinDate: doc.data().joinDate?.toDate() || doc.data().joinDate,
      lastOrder: doc.data().lastOrder?.toDate() || doc.data().lastOrder,
    }));
    
    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers. Please try again.');
  }
};

export const fetchCustomerOrders = async (customerId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', customerId)
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().orderDate?.toDate() || doc.data().orderDate,
    }));
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw new Error('Failed to fetch customer orders. Please try again.');
  }
};

export const createCustomer = async (customerData) => {
  try {
    const { name, email, phone } = customerData;
    if (!name || !email || !phone) {
      throw new Error('Name, email, and phone are required');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Invalid email format');
    }
    const customerRef = await addDoc(collection(db, 'customers'), {
      name,
      email,
      phone,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: serverTimestamp(),
      lastOrder: null,
    });
    return { id: customerRef.id, ...customerData, totalOrders: 0, totalSpent: 0, joinDate: new Date() };
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error(error.message || 'Failed to create customer. Please try again.');
  }
};