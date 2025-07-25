import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCustomers, fetchCustomerOrders, createCustomer } from './../services/customerService';

const initialState = {
  customers: [],
  selectedCustomer: null,
  customerOrders: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
  },
};

export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async (filters, { rejectWithValue }) => {
    try {
      const customers = await fetchCustomers(filters);
      return customers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCustomerOrders = createAsyncThunk(
  'customers/getCustomerOrders',
  async (customerId, { rejectWithValue }) => {
    try {
      const orders = await fetchCustomerOrders(customerId);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const newCustomer = await createCustomer(customerData);
      return newCustomer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearCustomerOrders: (state) => {
      state.customerOrders = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(getCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomer, clearCustomerOrders, setFilters, resetFilters, clearError } = customerSlice.actions;
export default customerSlice.reducer;