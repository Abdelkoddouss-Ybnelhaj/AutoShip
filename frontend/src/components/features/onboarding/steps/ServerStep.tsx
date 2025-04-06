"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectOnboardingData,
  selectErrors,
  setField,
} from "@/store/slice/onboardingSlice";
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
import { AlertCircle, HardDrive, HelpCircle, Info, Key } from "lucide-react";
import { generateSSHKey } from "@/api/backend";

export default function ServerStep() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectOnboardingData);
  const errors = useAppSelector(selectErrors);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleChange = (field: keyof typeof formData, value: any) => {
    dispatch(setField({ field, value }));
  };

  const handleGenerateSSHKey = async () => {
    setIsGeneratingKey(true);
    try {
      const key = await generateSSHKey();
      dispatch(setField({ field: "sshKey", value: key }));
    } catch (error) {
      console.error("Failed to generate SSH key:", error);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  return (
    <div className="space-y-4">
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
            value={formData.serverIP}
            onChange={(e) => handleChange("serverIP", e.target.value)}
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

      <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          SSH Authentication <span className="text-destructive">*</span>
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sshKey" className="text-sm font-medium">
              SSH Key
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
            id="sshKey"
            value={formData.sshKey}
            onChange={(e) => handleChange("sshKey", e.target.value)}
            placeholder="Paste your SSH public key here"
            className={`font-mono text-xs h-20 ${
              errors.sshKey ? "border-destructive" : ""
            }`}
            required
          />
          {errors.sshKey && (
            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.sshKey}
            </p>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            <p>
              <strong>Required:</strong> This SSH key will be used to securely
              connect to your server during deployments.
            </p>
          </div>
        </div>
      </div>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 py-2">
        <Info className="h-3 w-3" />
        <AlertDescription className="text-xs">
          <strong>Where to find your SSH key:</strong>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>
              Linux/Mac:{" "}
              <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[10px]">
                ~/.ssh/id_rsa.pub
              </code>
            </li>
            <li>
              Windows:{" "}
              <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-[10px]">
                C:\Users\YourUsername\.ssh\id_rsa.pub
              </code>
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
