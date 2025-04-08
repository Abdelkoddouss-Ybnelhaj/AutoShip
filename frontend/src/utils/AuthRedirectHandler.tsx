"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken, setUser } from "@/store/slice/authenticationSlice";
import { saveToken, getUserFromToken } from "@/utils/auth";

const AuthRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const params = new URLSearchParams(location.search);
      const success = params.get("success");
      const token = params.get("token");

      if (success === "true" && token) {
        try {
          // Save token to localStorage
          saveToken(token);

          // Decode user from token
          const decodedUser = getUserFromToken(token);

          if (decodedUser) {
            // Update Redux state
            dispatch(setToken(token));
            dispatch(setUser(decodedUser));

            // Clean the URL and redirect to onboarding
            window.history.replaceState({}, document.title, "/login");
            navigate("/onboarding", { replace: true });
          } else {
            throw new Error("Invalid token");
          }
        } catch (err) {
          console.error("Authentication failed:", err);
          navigate("/", {
            replace: true,
            state: { error: "Authentication failed" },
          });
        }
      } else if (params.has("error")) {
        // Handle OAuth error
        const errorMsg =
          params.get("error_description") || "Authentication failed";
        navigate("/", {
          replace: true,
          state: { error: errorMsg },
        });
      } else {
        // No token or success parameter, redirect to home
        navigate("/", { replace: true });
      }
    };

    handleAuthRedirect();
  }, [location, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3 text-lg">Authenticating...</span>
    </div>
  );
};

export default AuthRedirectHandler;
