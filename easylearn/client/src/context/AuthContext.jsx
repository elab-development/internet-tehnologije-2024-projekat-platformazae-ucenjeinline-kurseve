/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';

import { initialSignInFormData, initialSignUpFormData } from '../config';
import {
  checkAuthService,
  loginService,
  registerService,
} from '../api/auth/authService';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    await registerService(signUpFormData);
    setLoading(false);
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await loginService(signInFormData);

    if (data.success) {
      sessionStorage.setItem(
        'accessToken',
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticated: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticated: false,
        user: null,
      });
    }
    setLoading(false);
  };

  const resetCredentials = () => {
    setAuth({
      authenticated: false,
      user: null,
    });
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await checkAuthService();

      if (data?.success) {
        setAuth({
          authenticated: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticated: false,
          user: null,
        });
      }
      setLoading(false);
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuth({
          authenticated: false,
          user: null,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        resetCredentials,
        auth,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('No AuthContext found!');
  }

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    resetCredentials,
    auth,
  } = context;

  return {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    resetCredentials,
    auth,
  };
};
