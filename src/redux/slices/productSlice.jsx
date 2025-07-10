import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from './../services/productService';
import { toast } from 'react-toastify';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      return await getProducts(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const newProduct = await addProduct(productData);
      toast.success('Product created successfully!');
      return newProduct;
    } catch (error) {
      toast.error('Failed to create product');
      return rejectWithValue(error.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProduct(id, productData);
      toast.success('Product updated successfully!');
      return updatedProduct;
    } catch (error) {
      toast.error('Failed to update product');
      return rejectWithValue(error.message);
    }
  }
);

export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully!');
      return id;
    } catch (error) {
      toast.error('Failed to delete product');
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentProduct: null,
    filters: {
      search: '',
      category: '',
      status: '',
      stockStatus: ''
    }
  },
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        status: '',
        stockStatus: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(prod => prod.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(prod => prod.id !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setCurrentProduct, 
  clearCurrentProduct,
  setFilters,
  resetFilters
} = productSlice.actions;
export default productSlice.reducer;