import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import { loginUser, registerUser, logoutUser, loadUser, clearError } from '../store/authSlice';
import type { LoginCredentials, RegisterData } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const loadUserData = useCallback(() => {
    return dispatch(loadUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUserData,
    clearAuthError,
  };
};