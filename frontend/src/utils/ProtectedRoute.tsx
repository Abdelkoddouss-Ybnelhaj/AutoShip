"use client";

import type React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, initializeAuth } = useAuth();

  // Try to initialize auth if not already authenticated
  if (!isAuthenticated) {
    const authInitialized = initializeAuth();
    if (!authInitialized) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
