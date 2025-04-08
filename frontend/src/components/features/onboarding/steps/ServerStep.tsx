"use client";

import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  HardDrive,
  HelpCircle,
  Info,
  Key,
  User,
} from "lucide-react";

export default function ServerStep() {
  const { onboardingData, errors, updateOnboardingData, generateSSHKey } =
    useOnboarding();
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleGenerateSSHKey = async () => {
    setIsGeneratingKey(true);
    try {
      await generateSSHKey();
    } finally {
      setIsGeneratingKey(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Server Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the server where your application will be deployed.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="serverIP" className="text-sm font-medium">
            Server IP Address <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Enter the IP address of your deployment server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="serverIP"
            value={onboardingData.serverIP}
            onChange={(e) => updateOnboardingData("serverIP", e.target.value)}
            placeholder="192.168.1.1"
            className={`pl-10 ${errors.serverIP ? "border-destructive" : ""}`}
          />
        </div>
        {errors.serverIP && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.serverIP}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          The IP address of the server where your application will be deployed.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="serverUsername" className="text-sm font-medium">
            Server Username <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Username for server login (e.g., root, ubuntu, ec2-user)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="serverUsername"
            value={onboardingData.serverUsername}
            onChange={(e) =>
              updateOnboardingData("serverUsername", e.target.value)
            }
            placeholder="ubuntu"
            className={`pl-10 ${
              errors.serverUsername ? "border-destructive" : ""
            }`}
          />
        </div>
        {errors.serverUsername && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.serverUsername}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          The username used to access your deployment server.
        </p>
      </div>

      <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          SSH Private Key <span className="text-destructive">*</span>
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sshPrivateKey" className="text-sm font-medium">
              SSH Private Key
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSSHKey}
              disabled={isGeneratingKey}
              className="text-xs h-7 gap-1"
            >
              <Key className="h-3 w-3" />
              {isGeneratingKey ? "Generating..." : "Generate Key"}
            </Button>
          </div>
          <Textarea
            id="sshPrivateKey"
            value={onboardingData.sshPrivateKey || ""}
            onChange={(e) =>
              updateOnboardingData("sshPrivateKey", e.target.value)
            }
            placeholder="-----BEGIN RSA PRIVATE KEY-----..."
            className={`font-mono text-xs h-32 ${
              errors.sshPrivateKey ? "border-destructive" : ""
            }`}
          />
          {errors.sshPrivateKey && (
            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.sshPrivateKey}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Your SSH private key is required for secure server access. We'll
            store it securely and use it for deployments.
          </p>
        </div>
      </div>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 py-2">
        <Info className="h-3 w-3" />
        <AlertDescription>
          <p className="text-sm">
            <strong>Important:</strong> Make sure your server is accessible and
            the SSH key has been added to the server's authorized_keys file. The
            server must have Docker installed.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
