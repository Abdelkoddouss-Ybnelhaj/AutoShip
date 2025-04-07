"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setToken,
  setUser,
  clearAuth,
} from "@/store/slice/authenticationSlice";
import { removeToken, getUserFromToken, getToken } from "@/utils/auth";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // Login function - redirects to GitHub OAuth
  const login = () => {
    console.log(import.meta.env.VITE_API_BASE_URL
    )
    try {
      setIsLoading(true);
      window.location.href = `${
        import.meta.env.VITE_API_BASE_URL
      }/oauth2/authorization/github`;
    } catch (err) {
      setError("Something went wrong while redirecting.");
      setIsLoading(false);
    }
  };

  // Logout function - clears auth state and redirects to login
  const logout = () => {
    removeToken();
    dispatch(clearAuth());
    navigate("/login");
  };

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    const storedToken = getToken();

    if (storedToken) {
      const decodedUser = getUserFromToken(storedToken);
      if (decodedUser) {
        dispatch(setToken(storedToken));
        dispatch(setUser(decodedUser));
        return true; // Authentication successful
      } else {
        removeToken(); // Remove invalid token
      }
    }
    return false; // Not authenticated
  };

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
  }, [dispatch]);

  return {
    login,
    logout,
    initializeAuth,
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
  };
};
