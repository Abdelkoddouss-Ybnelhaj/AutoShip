import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Update the OnboardingState interface to include the new fields
export interface OnboardingState {
  currentStep: number;
  data: {
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
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// Update the initialState to include the new fields
const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    repository: "",
    branch: "",
    event: "push",
    serverIP: "",
    sshPrivateKey: "",
    sshPublicKey: "",
    dockerUsername: "",
    dockerPassword: "",
    serverUsername: "",
    useDockerCompose: false,
    runningCommand: "",
  },
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: keyof OnboardingState["data"]; value: any }>) => {
      const { field, value } = action.payload;
      state.data[field] = value;

      // Clear error for this field if it exists
      if (state.errors[field]) {
        delete state.errors[field];
      }
    },
    setError: (state, action: PayloadAction<{ field: string; message: string }>) => {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    startSubmitting: (state) => {
      state.isSubmitting = true;
    },
    submissionSuccess: (state) => {
      state.isSubmitting = false;
      state.isSubmitted = true;
    },
    submissionFailed: (state) => {
      state.isSubmitting = false;
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setField,
  setError,
  clearError,
  nextStep,
  prevStep,
  goToStep,
  startSubmitting,
  submissionSuccess,
  submissionFailed,
  resetForm,
} = onboardingSlice.actions;

// Selectors
export const selectCurrentStep = (state: RootState) => state.onboarding.currentStep;
export const selectOnboardingData = (state: RootState) => state.onboarding.data;
export const selectErrors = (state: RootState) => state.onboarding.errors;
export const selectIsSubmitting = (state: RootState) => state.onboarding.isSubmitting;
export const selectIsSubmitted = (state: RootState) => state.onboarding.isSubmitted;

export default onboardingSlice.reducer;
