import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, firestore } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Check admin role in Firestore
      const userDoc = await getDoc(doc(firestore, 'admins', user.uid));
      
      if (!userDoc.exists()) {
        await auth.signOut();
        throw new Error('User is not an admin');
      }

      const userData = userDoc.data();
      
      if (userData.role !== 'admin') {
        await auth.signOut();
        throw new Error('Insufficient permissions');
      }

      // 3. Save to localStorage if rememberMe is true
      if (rememberMe) {
        localStorage.setItem(
          'adminAuth',
          JSON.stringify({ email, uid: user.uid }) // Removed password from storage for security
        );
      } else {
        localStorage.removeItem('adminAuth');
      }

      return { uid: user.uid, email: user.email, role: userData.role };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No admin found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Account temporarily locked due to many failed attempts';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Check for persisted auth
export const checkPersistedAuth = createAsyncThunk(
  'auth/checkPersistedAuth',
  async (_, { rejectWithValue }) => {
    try {
      const persistedAuth = localStorage.getItem('adminAuth');
      if (!persistedAuth) return null;
      
      const { email, uid } = JSON.parse(persistedAuth);
      
      // Verify the user is still authenticated
      if (!auth.currentUser || auth.currentUser.uid !== uid) {
        localStorage.removeItem('adminAuth');
        return null;
      }
      
      // Verify admin role again
      const userDoc = await getDoc(doc(firestore, 'admins', uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await auth.signOut();
        localStorage.removeItem('adminAuth');
        return null;
      }
      
      return { uid, email, role: userDoc.data().role };
    } catch (error) {
      localStorage.removeItem('adminAuth');
      return rejectWithValue('Session validation failed');
    }
  }
);

// Logout action
export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async () => {
    await auth.signOut();
    localStorage.removeItem('adminAuth');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        toast.success('Login successful');
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Persisted auth check cases
      .addCase(checkPersistedAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPersistedAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkPersistedAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        toast.info('Logged out successfully');
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        toast.error('Logout failed');
      });
  }
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;