import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, firestore } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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

      if (rememberMe) {
        localStorage.setItem(
          'adminAuth',
          JSON.stringify({ email, uid: user.uid })
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
      
      if (!auth.currentUser || auth.currentUser.uid !== uid) {
        localStorage.removeItem('adminAuth');
        return null;
      }
      
      const userDoc = await getDoc(doc(firestore, 'admins', uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await auth.signOut();
        localStorage.removeItem('adminAuth');
        return null;
      }
      
      return { uid, email, role: userDoc.data().role };
    } catch (error) {
      console.log(error);
      localStorage.removeItem('adminAuth');
      return rejectWithValue('Session validation failed');
    }
  }
);

// Listen to auth changes
export const listenToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(firestore, 'admins', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              dispatch(setAuthState({
                user: {
                  uid: user.uid,
                  email: user.email,
                  role: userDoc.data().role
                },
                isAuthenticated: true
              }));
            } else {
              await auth.signOut();
              localStorage.removeItem('adminAuth');
              dispatch(clearAuthState());
            }
          } catch (error) {
            console.error('Error verifying admin status:', error);
            dispatch(clearAuthState());
          }
        } else {
          localStorage.removeItem('adminAuth');
          dispatch(clearAuthState());
        }
      });
      
      resolve(unsubscribe);
    });
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

// Send password reset email
export const sendResetPasswordEmail = createAsyncThunk(
  'auth/sendResetPasswordEmail',
  async (email, { rejectWithValue }) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Invalid email format');
      }
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent successfully. Please check your inbox.');
      return { success: true, message: 'Password reset email sent successfully.' };
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    authChecked: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.authChecked = true;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
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
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
      })
      // Password reset cases
      .addCase(sendResetPasswordEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetPasswordEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setLoading, setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;