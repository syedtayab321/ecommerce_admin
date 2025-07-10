// src/services/productService.js
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getProducts = async (filters = {}) => {
  try {
    let q = collection(db, 'products');
    
    // Apply filters if provided
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.stockStatus) {
      q = query(q, where('stockStatus', '==', filters.stockStatus));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    // Commented out image upload for now
    /*
    let imageUrl = productData.images;
    if (productData.images instanceof File) {
      const storageRef = ref(storage, `products/${Date.now()}_${productData.images.name}`);
      await uploadBytes(storageRef, productData.images);
      imageUrl = await getDownloadURL(storageRef);
    }
    */
    
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      // images: imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    // Commented out image upload for now
    /*
    let imageUrl = productData.images;
    if (productData.images instanceof File) {
      const storageRef = ref(storage, `products/${Date.now()}_${productData.images.name}`);
      await uploadBytes(storageRef, productData.images);
      imageUrl = await getDownloadURL(storageRef);
    }
    */
    
    await updateDoc(doc(db, 'products', productId), {
      ...productData,
      // images: imageUrl,
      updatedAt: new Date().toISOString()
    });
    return { id: productId, ...productData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};