import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from './../services/categoryService';
import { toast } from 'react-toastify';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const newCategory = await addCategory(categoryData);
      toast.success('Category created successfully!');
      return newCategory;
    } catch (error) {
      toast.error('Failed to create category');
      return rejectWithValue(error.message);
    }
  }
);

export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      toast.success('Category updated successfully!');
      return updatedCategory;
    } catch (error) {
      toast.error('Failed to update category');
      return rejectWithValue(error.message);
    }
  }
);

export const removeCategory = createAsyncThunk(
  'categories/removeCategory',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete category');
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentCategory: null
  },
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Category
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Category
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(cat => cat.id !== action.payload);
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentCategory, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;