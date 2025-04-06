import { OnboardingData } from "@/types/onboarding";

export async function sendOnboardingData(data: OnboardingData): Promise<void> {
  // This would be a real API call in a production app
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate successful API call
      console.log("Sending onboarding data to API:", data);
      resolve();

      // Uncomment to simulate an error
      // reject(new Error('API error'));
    }, 2000);
  });
}

export async function generateSSHKey(): Promise<string> {
  // In a real app, this would call an API to generate a key pair
  // For demo purposes, we'll return a mock SSH key
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSSHKey = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDEXAMPLEKEYWOULDBE
  FORDEMOPURPOSESXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLM
  NOPQRSTUVWXYZ+/abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOP
  QRSTUVWXYZ+/abcdefghijklmnopqrstuvwxyz0123456789== user@example.com`;
      resolve(mockSSHKey);
    }, 500);
  });
}

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
