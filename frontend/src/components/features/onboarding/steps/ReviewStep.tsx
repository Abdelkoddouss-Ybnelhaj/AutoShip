"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Database,
  FileCode2,
  Github,
  Info,
  Key,
  Layers,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewStepProps {
  onSubmit: () => void;
}

export default function ReviewStep({ onSubmit }: ReviewStepProps) {
  const { onboardingData, isSubmitting } = useOnboarding();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review Your Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please review all settings before completing the setup.
        </p>
      </div>

      <div className="space-y-3">
        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Repository Setup</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">
                  GitHub Repository:
                </dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.repository}
                </dd>
              </div>
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">Branch:</dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.branch}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Trigger Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <dl className="grid grid-cols-1 gap-y-1 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">
                  Trigger Events:
                </dt>
                <dd className="font-medium text-xs mt-1 flex flex-wrap gap-1">
                  {onboardingData.events.map((event) => (
                    <Badge
                      key={event}
                      variant="secondary"
                      className="capitalize"
                    >
                      {event.replace("_", " ")}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Server Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">Server IP:</dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.serverIP}
                </dd>
              </div>
              <div className="flex justify-between md:block mt-1">
                <dt className="text-muted-foreground text-xs">
                  Server Username:
                </dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.serverUsername}
                </dd>
              </div>
              <div className="mt-1">
                <dt className="text-muted-foreground text-xs flex items-center gap-1">
                  <Key className="h-3 w-3" /> SSH Key:
                </dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.sshPrivateKey
                    ? "Private Key provided"
                    : "No SSH key provided"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Docker Registry</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">Registry:</dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.dockerRegistry}
                </dd>
              </div>
              <div className="flex justify-between md:block mt-1">
                <dt className="text-muted-foreground text-xs">Username:</dt>
                <dd className="font-medium text-xs md:mt-0.5">
                  {onboardingData.dockerUsername}
                </dd>
              </div>
              <div className="flex justify-between md:block mt-1">
                <dt className="text-muted-foreground text-xs">
                  Password/Token:
                </dt>
                <dd className="font-medium text-xs md:mt-0.5">••••••••••••</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Deployment Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">
                  Deployment Method:
                </dt>
                <dd className="font-medium text-xs md:mt-0.5 flex items-center gap-1">
                  {onboardingData.useDockerCompose ? (
                    <>
                      <Layers className="h-3 w-3" /> Docker Compose
                    </>
                  ) : (
                    <>
                      <FileCode2 className="h-3 w-3" /> Dockerfile
                    </>
                  )}
                </dd>
              </div>
              <div className="flex justify-between md:block">
                <dt className="text-muted-foreground text-xs">Run Command:</dt>
                <dd className="font-medium md:mt-0.5 font-mono text-[10px] bg-muted p-1 rounded mt-1">
                  {onboardingData.runningCommand}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 py-2">
        <Info className="h-3 w-3" />
        <AlertDescription className="text-xs">
          Please review your configuration carefully before submitting. Once
          submitted, your deployment pipeline will be created with these
          settings.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center pt-2">
        <Button
          onClick={onSubmit}
          className="gap-1 w-full"
          disabled={isSubmitting}
          size="sm"
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
      </div>
    </div>
  );
}
