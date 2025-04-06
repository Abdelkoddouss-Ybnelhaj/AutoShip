"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectCurrentStep,
  selectOnboardingData,
  selectErrors,
  selectIsSubmitting,
  selectIsSubmitted,
  nextStep,
  prevStep,
  goToStep,
  startSubmitting,
  submissionSuccess,
  submissionFailed,
} from "@/store/slice/onboardingSlice";
import { fetchUserRepos, sendOnboardingData } from "@/api/backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Server,
  Github,
  Zap,
  Terminal,
  Rocket,
} from "lucide-react";

import RepositoryStep from "./steps/RepositoryStep";
import TriggerStep from "./steps/TriggerStep";
import ServerStep from "./steps/ServerStep";
import DeploymentStep from "./steps/DeploymentStep";
import ReviewStep from "./steps/ReviewStep";
import SuccessStep from "./steps/SuccessStep";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

function Onboarding() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const formData = useAppSelector(selectOnboardingData);
  const errors = useAppSelector(selectErrors);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const isSubmitted = useAppSelector(selectIsSubmitted);

  const user = useSelector((state: RootState) => state.auth.user); // Access user data from Redux state

  console.log("User data from Redux:", user); // Log user data to check if it's available

  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  
  const totalSteps = 5; // Including review step

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      // Calculate progress percentage (capped at 100%)
      const progressPercentage = Math.min(
        ((currentStep - 1) / (totalSteps - 1)) * 100,
        100
      );
      setProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, totalSteps]);

  // Update the validateCurrentStep function to make SSH key required
  const validateCurrentStep = (): boolean => {
    let isValid = true;
    const currentErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Repository step
        if (!formData.repository) {
          currentErrors.repository = "Repository URL is required";
          isValid = false;
        } else if (!formData.repository.includes("github.com")) {
          currentErrors.repository = "Please enter a valid GitHub URL";
          isValid = false;
        }

        if (!formData.branch) {
          currentErrors.branch = "Branch name is required";
          isValid = false;
        }
        break;

      case 2: // Trigger step
        if (!formData.event) {
          currentErrors.event = "Trigger event is required";
          isValid = false;
        }
        break;

      case 3: // Server step
        if (!formData.serverIP) {
          currentErrors.serverIP = "Server IP address is required";
          isValid = false;
        } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.serverIP)) {
          currentErrors.serverIP = "Please enter a valid IP address";
          isValid = false;
        }

        if (!formData.sshKey) {
          currentErrors.sshKey =
            "SSH key is required for server authentication";
          isValid = false;
        }
        break;

      case 4: // Deployment step
        if (!formData.runningCommand) {
          currentErrors.runningCommand = "Run command is required";
          isValid = false;
        }
        break;
    }

    // Update Redux store with validation errors
    Object.entries(currentErrors).forEach(([field, message]) => {
      dispatch({ type: "onboarding/setError", payload: { field, message } });
    });

    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setDirection(1);
      dispatch(nextStep());
    }
  };

  const handleBack = () => {
    setDirection(-1);
    dispatch(prevStep());
  };

  const handleSubmit = async () => {
    if (validateCurrentStep()) {
      dispatch(startSubmitting());
      try {
        await sendOnboardingData(formData);
        dispatch(submissionSuccess());
        // Move to success step (step 6)
        dispatch(goToStep(6));
      } catch (error) {
        dispatch(submissionFailed());
        // Show error message
      }
    }
  };

  // Animation variants for step transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RepositoryStep />;
      case 2:
        return <TriggerStep />;
      case 3:
        return <ServerStep />;
      case 4:
        return <DeploymentStep />;
      case 5:
        return <ReviewStep onSubmit={handleSubmit} />;
      case 6:
        return <SuccessStep />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Repository Setup";
      case 2:
        return "Trigger Configuration";
      case 3:
        return "Server Configuration";
      case 4:
        return "Deployment Settings";
      case 5:
        return "Review Configuration";
      case 6:
        return "Setup Complete";
      default:
        return "";
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Github className="h-5 w-5 text-primary" />;
      case 2:
        return <Zap className="h-5 w-5 text-primary" />;
      case 3:
        return <Server className="h-5 w-5 text-primary" />;
      case 4:
        return <Terminal className="h-5 w-5 text-primary" />;
      case 5:
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 6:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Github className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side - Image and progress */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-primary/5 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">DeployDash</h2>
              <p className="text-muted-foreground">
                Setup your deployment pipeline
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Streamlined Deployment</h3>
              <p className="text-muted-foreground">
                Configure once, deploy anywhere with our secure and efficient
                pipeline.
              </p>

              <div className="space-y-4 mt-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Setup Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: "Repository Setup",
                      icon: <Github className="h-4 w-4" />,
                    },
                    {
                      name: "Trigger Configuration",
                      icon: <Zap className="h-4 w-4" />,
                    },
                    {
                      name: "Server Configuration",
                      icon: <Server className="h-4 w-4" />,
                    },
                    {
                      name: "Deployment Settings",
                      icon: <Terminal className="h-4 w-4" />,
                    },
                    {
                      name: "Review & Submit",
                      icon: <CheckCircle className="h-4 w-4" />,
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                        index + 1 === currentStep
                          ? "bg-primary/10 text-primary font-medium"
                          : index + 1 < currentStep
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index + 1 === currentStep
                            ? "bg-primary text-white"
                            : index + 1 < currentStep
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1 < currentStep ? "✓" : index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <span>{step.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mb-32 blur-3xl"></div>
          <div className="absolute top-20 right-10">
            <Server className="h-32 w-32 text-primary/10" />
          </div>

          {/* Illustration */}
          <div className="absolute bottom-6 right-6 flex items-center justify-center">
            <Rocket className="h-32 w-32 text-primary/20" />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-t-4 border-t-primary h-[calc(100vh-2rem)] max-h-[800px] flex flex-col">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {getStepTitle()}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {currentStep === 6
                      ? "Your deployment pipeline is ready"
                      : `Step ${currentStep} of ${totalSteps}`}
                  </CardDescription>
                </div>

                {/* Mobile progress indicator */}
                <div className="lg:hidden">
                  <Badge variant="outline" className="px-3 py-1">
                    {Math.round(progress)}%
                  </Badge>
                </div>
              </div>

              {/* Mobile progress bar */}
              <div className="mt-4 lg:hidden">
                <Progress value={progress} className="h-1" />
              </div>
            </CardHeader>

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                <CardContent className="pt-6 pb-4 flex-1 overflow-auto">
                  {renderStepContent()}
                </CardContent>
              </motion.div>
            </AnimatePresence>

            {currentStep < 6 && (
              <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
                <div>
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    size="sm"
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                </div>

                <div>
                  {currentStep < 5 ? (
                    <Button onClick={handleNext} size="sm" className="gap-1">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      size="sm"
                      className="gap-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Complete Setup <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Onboarding;
