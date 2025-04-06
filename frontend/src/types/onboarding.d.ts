export interface OnboardingData {
  repository: string;
  branch: string;
  event: string;
  serverIP: string;
  sshKey: string;
  useDockerCompose: boolean;
  runningCommand: string;
}
