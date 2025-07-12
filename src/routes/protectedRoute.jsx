import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from './../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth || loading) {
    return <LoadingSpinner fullPage />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;