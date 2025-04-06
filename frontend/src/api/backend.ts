import axios from "axios";
import { getToken } from "@/utils/auth";

// Type definition for onboarding data
export interface OnboardingData {
  repository: string;
  branch: string;
  event: string;
  serverIP: string;
  sshPrivateKey: string;
  sshPublicKey: string;
  dockerUsername: string;
  dockerPassword: string;
  serverUsername: string;
  useDockerCompose: boolean;
  runningCommand: string;
}

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

export const fetchUserRepos = async () => {
  const token = getToken();

  if (!token) throw new Error("No token found");

  try {
    const response = await axios.get("http://localhost:8080/api/v1/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Repos fetched:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch repos:", err);
    throw err;
  }
};
