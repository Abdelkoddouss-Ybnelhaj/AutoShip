"use client";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Input } from "@/components/ui/input";
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
  Lock,
  User,
  HelpCircle,
  Info,
  Database,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServerCredentialsStep() {
  const { onboardingData, errors, updateOnboardingData } = useOnboarding();

  const registryOptions = [
    { value: "docker.io", label: "Docker Hub (docker.io)" },
    { value: "ghcr.io", label: "GitHub Container Registry (ghcr.io)" },
    { value: "registry.gitlab.com", label: "GitLab Container Registry" },
    { value: "ecr.aws", label: "Amazon ECR" },
    { value: "gcr.io", label: "Google Container Registry" },
    { value: "azurecr.io", label: "Azure Container Registry" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Docker Registry Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Docker registry credentials for pulling and pushing
          images.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dockerRegistry" className="text-sm font-medium">
                Docker Registry <span className="text-destructive">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Select your Docker registry provider</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={onboardingData.dockerRegistry}
                onValueChange={(value) =>
                  updateOnboardingData("dockerRegistry", value)
                }
              >
                <SelectTrigger
                  className={`pl-10 ${
                    errors.dockerRegistry ? "border-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a registry" />
                </SelectTrigger>
                <SelectContent>
                  {registryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.dockerRegistry && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.dockerRegistry}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dockerUsername" className="text-sm font-medium">
                Docker Username <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dockerUsername"
                value={onboardingData.dockerUsername || ""}
                onChange={(e) =>
                  updateOnboardingData("dockerUsername", e.target.value)
                }
                placeholder="Your Docker registry username"
                className={`pl-10 ${
                  errors.dockerUsername ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.dockerUsername && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.dockerUsername}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dockerPassword" className="text-sm font-medium">
                Docker Password / Token{" "}
                <span className="text-destructive">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      Use an access token instead of your password when possible
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dockerPassword"
                type="password"
                value={onboardingData.dockerPassword || ""}
                onChange={(e) =>
                  updateOnboardingData("dockerPassword", e.target.value)
                }
                placeholder="Your Docker registry password or token"
                className={`pl-10 ${
                  errors.dockerPassword ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.dockerPassword && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.dockerPassword}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Security Note:</strong> Your credentials will be encrypted
              and stored securely.
            </p>
            <p className="text-sm">
              <strong>Best Practice:</strong> We recommend using access tokens
              instead of your main password. Here's how to create them:
            </p>
            <ul className="text-xs list-disc pl-5 space-y-1">
              <li>
                <strong>Docker Hub:</strong> Go to Account Settings → Security →
                New Access Token
              </li>
              <li>
                <strong>GitHub:</strong> Settings → Developer settings →
                Personal access tokens
              </li>
              <li>
                <strong>GitLab:</strong> User Settings → Access Tokens
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
