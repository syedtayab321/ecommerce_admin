import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./../slices/authSlice";
import { checkPersistedAuth } from "./../slices/authSlice";
import categoryReducer from "./../slices/categorySlice";
import productReducer from "./../slices/productSlice";
import orderReducer from "./../slices/orderSlice";
import messagingReducer from "./../slices/messageSlice";
import customerReducer from './../slices/customerSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    messaging: messagingReducer,
    customers: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Initialize persisted auth on app load
store.dispatch(checkPersistedAuth());
