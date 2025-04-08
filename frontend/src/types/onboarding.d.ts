// This file defines the types used in the onboarding process

export interface OnboardingData {
  repository: string;
  branch: string;
  events: string[]; // Changed from event to events array
  serverIP: string;
  sshPrivateKey: string;
  dockerUsername: string;
  dockerPassword: string;
  dockerRegistry: string; // Added Docker registry
  serverUsername: string;
  useDockerCompose: boolean;
  runningCommand: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
