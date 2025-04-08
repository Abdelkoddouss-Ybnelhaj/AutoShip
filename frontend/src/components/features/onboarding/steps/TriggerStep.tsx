"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  ArrowRight,
  FileCode2,
  HelpCircle,
  Info,
  Layers,
  Tag,
} from "lucide-react";

export default function TriggerStep() {
  const { onboardingData, errors, toggleTriggerEvent } = useOnboarding();

  const triggerEvents = [
    {
      id: "push",
      name: "Push",
      description: "Deploy when code is pushed to the repository",
      icon: <ArrowRight className="h-5 w-5" />,
    },
    {
      id: "pull_request",
      name: "Pull Request",
      description: "Deploy when pull requests are opened or updated",
      icon: <FileCode2 className="h-5 w-5" />,
    },
    {
      id: "release",
      name: "Release",
      description: "Deploy when a new release is created",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      id: "workflow_dispatch",
      name: "Manual Trigger",
      description: "Deploy manually through GitHub Actions",
      icon: <Layers className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Trigger Events</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose one or more events that will trigger your deployment pipeline.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="event" className="text-sm font-medium">
            Trigger Events <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p>
                  Select one or more GitHub events that will trigger the
                  deployment
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          {triggerEvents.map((event) => (
            <Card
              key={event.id}
              className={`cursor-pointer border-2 transition-all ${
                onboardingData.events.includes(event.id)
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => toggleTriggerEvent(event.id)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="flex items-center h-5 mt-1">
                  <Checkbox
                    checked={onboardingData.events.includes(event.id)}
                    onCheckedChange={() => toggleTriggerEvent(event.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-full ${
                        onboardingData.events.includes(event.id)
                          ? "bg-primary/10"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={
                          onboardingData.events.includes(event.id)
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {event.icon}
                      </span>
                    </div>
                    <h4 className="font-medium">{event.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {errors.events && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.events}
          </p>
        )}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          Configuration Instructions
        </h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Multiple triggers:</strong> Your deployment can be triggered
            by multiple events. For example, you can deploy on both pushes and
            releases.
          </p>
          <p>
            <strong>Branch filtering:</strong> Events will only trigger
            deployments for the branch you specified in the previous step (
            {onboardingData.branch || "your selected branch"}).
          </p>
          <p>
            <strong>Webhook setup:</strong> We'll automatically configure the
            necessary GitHub webhooks for your selected triggers.
          </p>
        </div>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          You must select at least one trigger event. GitHub webhooks will be
          created automatically for your selected events.
        </AlertDescription>
      </Alert>
    </div>
  );
}
