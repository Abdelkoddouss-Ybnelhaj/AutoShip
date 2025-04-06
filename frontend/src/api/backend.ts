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

// src/api/github.ts

// import axios from "axios";
// import { getToken } from "@/utils/auth";

// export const fetchUserRepos = async () => {
//   const token =
//     "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsImFjY2Vzcy10b2tlbiI6Imdob19qYWN3V1pMd0Njbng2VWtLVTR4aUhLVEkzTzRmRXEzb3hBbEciLCJsb2dpbiI6IkFiZGVsa29kZG91c3MtWWJuZWxoYWoiLCJ1c2VybmFtZSI6IkFiZGVsa29kZG91c3MgWWJuZWxoYWoiLCJzdWIiOiIxNzA3Mzk2MjYiLCJpYXQiOjE3NDM5NTQ3MTYsImV4cCI6MTc0Mzk2MzM1Nn0.Suq_Pn7RJKTCcEpZS8t_gzNiPlo0lBkAdBdrrKHL_EQ";
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   if (!token) throw new Error("No token found");

//   const response = await axios.get("http://localhost:8080/api/v1/repos", {
//     headers
//   });
//   console.log("Response:", response);

//   return response.data.data; // returns the repo array
// };



import { getToken } from "@/utils/auth";
import axios from "axios";

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
