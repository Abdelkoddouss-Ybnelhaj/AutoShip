"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectOnboardingData,
  selectErrors,
  setField,
} from "@/store/slice/onboardingSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowRight,
  FileCode2,
  HelpCircle,
  Info,
  Layers,
} from "lucide-react";

export default function TriggerStep() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectOnboardingData);
  const errors = useAppSelector(selectErrors);

  const handleEventChange = (value: string) => {
    dispatch(setField({ field: "event", value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="event" className="text-sm font-medium">
            Trigger Event
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p>Specify which GitHub event will trigger the deployment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card
            className={`cursor-pointer border-2 transition-all ${
              formData.event === "push"
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleEventChange("push")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className={`p-2 rounded-full mb-2 ${
                  formData.event === "push" ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <ArrowRight
                  className={`h-5 w-5 ${
                    formData.event === "push"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <h4 className="font-medium">Push</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Deploy when code is pushed
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 transition-all ${
              formData.event === "pull_request"
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleEventChange("pull_request")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className={`p-2 rounded-full mb-2 ${
                  formData.event === "pull_request"
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}
              >
                <FileCode2
                  className={`h-5 w-5 ${
                    formData.event === "pull_request"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <h4 className="font-medium">Pull Request</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Deploy on PR events
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 transition-all ${
              formData.event === "release"
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleEventChange("release")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className={`p-2 rounded-full mb-2 ${
                  formData.event === "release" ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Layers
                  className={`h-5 w-5 ${
                    formData.event === "release"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <h4 className="font-medium">Release</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Deploy on new releases
              </p>
            </CardContent>
          </Card>
        </div>

        {errors.event && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.event}
          </p>
        )}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Event Details
        </h4>
        {formData.event === "push" && (
          <p className="text-sm text-muted-foreground">
            Deployment will be triggered automatically when code is pushed to
            the{" "}
            <span className="font-medium">{formData.branch || "selected"}</span>{" "}
            branch. This is ideal for continuous deployment workflows.
          </p>
        )}
        {formData.event === "pull_request" && (
          <p className="text-sm text-muted-foreground">
            Deployment will be triggered when a pull request is opened, updated,
            or merged to the{" "}
            <span className="font-medium">{formData.branch || "selected"}</span>{" "}
            branch. This is useful for preview deployments.
          </p>
        )}
        {formData.event === "release" && (
          <p className="text-sm text-muted-foreground">
            Deployment will be triggered when a new release is created in your
            repository. This is recommended for production deployments with
            versioning.
          </p>
        )}
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          A GitHub webhook will be created to trigger deployments automatically
          when the selected event occurs.
        </AlertDescription>
      </Alert>
    </div>
  );
}
