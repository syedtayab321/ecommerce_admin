import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchOrders, 
  createOrder, 
  updateOrderStatus, 
  confirmOrder, 
  deleteOrder 
} from './../services/orderService';

// Async Thunks
export const getOrders = createAsyncThunk(
  'orders/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchOrders(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status, discount, notes }, { rejectWithValue }) => {
    try {
      return await updateOrderStatus(orderId, status, { discount, notes });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/confirm',
  async ({ orderId, discount, notes, items }, { rejectWithValue }) => {
    try {
      return await confirmOrder(orderId, { discount, notes }, items);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeOrder = createAsyncThunk(
  'orders/delete',
  async (orderId, { rejectWithValue }) => {
    try {
      return await deleteOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
  filters: {
    searchTerm: '',
    status: 'all',
    dateFilter: 'all'
  }
};

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Order
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Change Status
      .addCase(changeOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = { 
            ...state.orders[index], 
            status: action.payload.status,
            discount: action.payload.discount,
            notes: action.payload.notes
          };
        }
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Confirm Order
      .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = { 
            ...state.orders[index], 
            status: 'accepted',
            discount: action.payload.discount,
            notes: action.payload.notes
          };
        }
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Order
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetFilters, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;