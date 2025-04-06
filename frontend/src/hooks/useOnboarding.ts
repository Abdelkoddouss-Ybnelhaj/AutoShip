// hooks/useOnboarding.ts
import { useState } from "react";
import { OnboardingData } from "../types/onboarding";
import { submitOnboardingData } from "../api/backend";

export function useOnboarding() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    githubRepo: "",
    branch: "",
    event: "",
    serverIp: "",
    isDockerCompose: true,
    runCommand: "",
    sshKey: "",
  });

  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const submitData = async () => {
    try {
      const result = await submitOnboardingData(onboardingData);
      console.log("Onboarding completed", result);
    } catch (error) {
      console.error("Onboarding submission failed", error);
    }
  };

  return {
    onboardingData,
    updateOnboardingData,
    submitData,
  };
}
