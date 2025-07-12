import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listenToAuthChanges } from './redux/slices/authSlice';
import LoginForm from './pages/auth/loginPage';
import MainPage from './pages/main/MainPage';
import ProtectedRoute from './routes/protectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Set up the auth state listener when the app loads
    const setupAuthListener = async () => {
      unsubscribeRef.current = await dispatch(listenToAuthChanges());
    };
    setupAuthListener();
    
    return () => {
      // Clean up the listener when the component unmounts
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [dispatch]);

  // Show loading spinner while checking auth state
  if (!authChecked) {
    return <LoadingSpinner/>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
      />
      
      {/* Redirect root path based on auth state */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainPage />} />
      </Route>

      {/* 404 page */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;