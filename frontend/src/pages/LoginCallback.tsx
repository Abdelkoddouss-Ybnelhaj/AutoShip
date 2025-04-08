import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LoginCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const success = query.get("success");
    const token = query.get("token");

    if (success === "true" && token) {
      // ✅ Store the token securely
      localStorage.setItem("accessToken", token);

      // ✅ Set default token for future axios calls
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Redirect to dashboard or onboarding
      navigate("/dashboard");
    } else {
      navigate("/login?error=OAuthFailed");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
};

export default LoginCallback;
