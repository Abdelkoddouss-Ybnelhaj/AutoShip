import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  selectOnboardingData,
  selectErrors,
  selectIsSubmitting,
  selectIsSubmitted,
  setField,
  startSubmitting,
  submissionSuccess,
  submissionFailed,
  nextStep,
  prevStep,
  goToStep,
  toggleEvent,
} from "@/store/slice/onboardingSlice";
import { sendOnboardingData, generateSSHKey } from "@/api/backend";

export function useOnboarding() {
  const dispatch = useAppDispatch();
  const onboardingData = useAppSelector(selectOnboardingData);
  const errors = useAppSelector(selectErrors);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const isSubmitted = useAppSelector(selectIsSubmitted);

  const updateOnboardingData = (
    field: keyof typeof onboardingData,
    value: any
  ) => {
    dispatch(setField({ field, value }));
  };

  const toggleTriggerEvent = (event: string) => {
    dispatch(toggleEvent(event));
  };

  const submitData = async () => {
    dispatch(startSubmitting());
    try {
      await sendOnboardingData(onboardingData);
      dispatch(submissionSuccess());
      dispatch(goToStep(7)); // Move to success step
      return true;
    } catch (error) {
      console.error("Onboarding submission failed", error);
      dispatch(submissionFailed());
      return false;
    }
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const generateNewSSHKey = async () => {
    try {
      const key = await generateSSHKey();
      updateOnboardingData("sshPrivateKey", key);
      return key;
    } catch (error) {
      console.error("Failed to generate SSH key:", error);
      return null;
    }
  };

  return {
    onboardingData,
    errors,
    isSubmitting,
    isSubmitted,
    updateOnboardingData,
    toggleTriggerEvent,
    submitData,
    handleNext,
    handleBack,
    generateSSHKey: generateNewSSHKey,
  };
}
