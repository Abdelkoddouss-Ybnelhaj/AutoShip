// This file defines the types used in the onboarding process

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

export interface ValidationErrors {
  [key: string]: string;
}
