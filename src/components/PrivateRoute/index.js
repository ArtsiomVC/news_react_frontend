import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchAuthMe } from '../../redux/slices/auth';

export const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isLoading, userData } = useSelector(state => state.auth);

  const getUserData = async () => {
    try {
      await dispatch(fetchAuthMe());
    } catch (err) {
      window.localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (!userData) getUserData();
  }, []);

  return (isLoading || !!userData) ? (
    <Suspense>
      <Outlet />
    </Suspense>
  ) : <Navigate to="/login" />;
};
