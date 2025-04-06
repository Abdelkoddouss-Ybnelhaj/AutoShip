"use client";
import { Provider, useSelector } from "react-redux";
import { store } from "@/store";
import Onboarding from "@/components/features/onboarding/onboarding";

export default function OnboardingContainer() {
  return (
    <div className=" w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <Onboarding />
    </div>
  );
}
