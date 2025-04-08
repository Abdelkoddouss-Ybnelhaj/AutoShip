import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, saveToken } from "@/utils/auth";

export default function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      saveToken(token);

      const needsOnboarding = true; // Replace with actual logic from your API

      navigate(needsOnboarding ? "/onboarding" : "/dashboard");
    } else if (getToken()) {
      navigate("/dashboard");
    } else {
      console.log("No authentication token found");
      navigate("/onboarding");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
}
