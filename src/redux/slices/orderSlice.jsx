import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchOrders, 
  updateOrderStatus, 
  confirmOrder, 
  deleteOrder 
} from './../services/orderService';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    status: 'all',
    dateFilter: 'all'
  }
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (filters, { rejectWithValue }) => {
    try {
      const orders = await fetchOrders(filters);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async ({ orderId, discount, notes, items }, { rejectWithValue }) => {
    try {
      const updatedOrder = await confirmOrder(orderId, { discount, notes }, items);
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeOrder = createAsyncThunk(
  'orders/removeOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await deleteOrder(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(changeOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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

export const { setCurrentOrder, setFilters, resetFilters } = orderSlice.actions;
export default orderSlice.reducer;