"use client"

import { useOnboarding } from "@/hooks/useOnboarding"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle, FileCode2, HelpCircle, Layers, Terminal } from "lucide-react"

export default function DeploymentStep() {
  const { onboardingData, errors, updateOnboardingData } = useOnboarding()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Deployment Method</Label>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Card
            className={`cursor-pointer border-2 transition-all ${
              onboardingData.useDockerCompose ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => updateOnboardingData("useDockerCompose", true)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-full ${onboardingData.useDockerCompose ? "bg-primary/10" : "bg-muted"}`}>
                  <Layers
                    className={`h-4 w-4 ${onboardingData.useDockerCompose ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Docker Compose</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Multiple containers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 transition-all ${
              !onboardingData.useDockerCompose ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => updateOnboardingData("useDockerCompose", false)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div
                  className={`p-1.5 rounded-full ${!onboardingData.useDockerCompose ? "bg-primary/10" : "bg-muted"}`}
                >
                  <FileCode2
                    className={`h-4 w-4 ${!onboardingData.useDockerCompose ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Dockerfile</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Single container</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="runningCommand" className="text-sm font-medium">
            Run Command <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p>Enter the command to run after deployment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="runningCommand"
            value={onboardingData.runningCommand}
            onChange={(e) => updateOnboardingData("runningCommand", e.target.value)}
            placeholder={onboardingData.useDockerCompose ? "docker-compose up -d" : "docker run -d -p 3000:3000 my-app"}
            className={`pl-10 ${errors.runningCommand ? "border-destructive" : ""}`}
          />
        </div>
        {errors.runningCommand && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.runningCommand}
          </p>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          <p>The command that will be executed to start your application.</p>
          <p className="mt-1">
            {onboardingData.useDockerCompose ? (
              <span>
                Example: <code className="bg-muted px-1 rounded">docker-compose up -d</code>
              </span>
            ) : (
              <span>
                Example: <code className="bg-muted px-1 rounded">docker run -d -p 3000:3000 my-image</code>
              </span>
            )}
          </p>
        </div>
      </div>

      <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-800 dark:text-green-300">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Your deployment configuration is almost ready! Review your settings in the next step.
        </AlertDescription>
      </Alert>
    </div>
  )
}

