import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Update the OnboardingState interface to include the new fields
export interface OnboardingState {
  currentStep: number;
  data: {
    repository: string;
    branch: string;
    events: string[]; // Changed from single event to array of events
    serverIP: string;
    sshPrivateKey: string; // Public key removed
    dockerUsername: string;
    dockerPassword: string;
    dockerRegistry: string; // Added Docker registry
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
    events: ["push"], // Default to push event
    serverIP: "",
    sshPrivateKey: "",
    dockerUsername: "",
    dockerPassword: "",
    dockerRegistry: "docker.io", // Default to Docker Hub
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
    setField: (
      state,
      action: PayloadAction<{
        field: keyof OnboardingState["data"];
        value: any;
      }>
    ) => {
      const { field, value } = action.payload;
      state.data[field] = value;

      // Clear error for this field if it exists
      if (state.errors[field]) {
        delete state.errors[field];
      }
    },
    setError: (
      state,
      action: PayloadAction<{ field: string; message: string }>
    ) => {
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
    // New action to toggle an event in the events array
    toggleEvent: (state, action: PayloadAction<string>) => {
      const event = action.payload;
      if (state.data.events.includes(event)) {
        state.data.events = state.data.events.filter((e) => e !== event);
      } else {
        state.data.events.push(event);
      }
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
  toggleEvent,
} = onboardingSlice.actions;

// Selectors
export const selectCurrentStep = (state: RootState) =>
  state.onboarding.currentStep;
export const selectOnboardingData = (state: RootState) => state.onboarding.data;
export const selectErrors = (state: RootState) => state.onboarding.errors;
export const selectIsSubmitting = (state: RootState) =>
  state.onboarding.isSubmitting;
export const selectIsSubmitted = (state: RootState) =>
  state.onboarding.isSubmitted;

export default onboardingSlice.reducer;
