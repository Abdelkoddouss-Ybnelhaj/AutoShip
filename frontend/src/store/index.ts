import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./slice/onboardingSlice";
import authReducer from "./slice/authenticationSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    auth: authReducer, // Add auth reducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
