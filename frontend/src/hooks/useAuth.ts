export const useAuth = () => {
  const login = async () => {
    // Mock implementation
    localStorage.setItem("mockAuth", "true");
    window.location.href = "/onboarding";
  };

  return {
    login,
    isLoading: false,
    error: null,
  };
};
