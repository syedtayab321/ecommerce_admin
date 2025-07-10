import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from './../../firebase/firebase';

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const q = query(collection(db, 'products'), where('category', '==', category.name));
        const snapshot = await getCountFromServer(q);
        return {
          ...category,
          productCount: snapshot.data().count
        };
      })
    );
    
    return categoriesWithCounts;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const addCategory = async (categoryData) => {
  try {
    // Check if category already exists
    const q = query(collection(db, 'categories'), where('name', '==', categoryData.name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Category with this name already exists');
    }

    const docRef = await addDoc(collection(db, 'categories'), {
      name: categoryData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message || 'Failed to add category');
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    // Check if another category with the same name exists
    const q = query(
      collection(db, 'categories'),
      where('name', '==', categoryData.name),
      where('__name__', '!=', categoryId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Another category with this name already exists');
    }

    await updateDoc(doc(db, 'categories', categoryId), {
      name: categoryData.name,
      updatedAt: new Date().toISOString()
    });
    
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message || 'Failed to update category');
  }
};

export const deleteCategory = async (categoryId, categoryName) => {
  try {
    // Check if any products are using this category
    const q = query(collection(db, 'products'), where('category', '==', categoryName));
    const snapshot = await getCountFromServer(q);
    
    if (snapshot.data().count > 0) {
      throw new Error('Cannot delete category - it is being used by products');
    }

    await deleteDoc(doc(db, 'categories', categoryId));
    return categoryId;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message || 'Failed to delete category');
  }
};