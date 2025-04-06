"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  selectOnboardingData,
  selectErrors,
  setField,
} from "@/store/slice/onboardingSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Github, Code, HelpCircle, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RepositoryStep() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectOnboardingData);
  const errors = useAppSelector(selectErrors);

  const handleChange = (field: keyof typeof formData, value: string) => {
    dispatch(setField({ field, value }));
  };

  // Sample repositories for the dropdown
  const repositories = [
    { value: "https://github.com/user/project-a", label: "project-a" },
    { value: "https://github.com/user/project-b", label: "project-b" },
    { value: "https://github.com/user/project-c", label: "project-c" },
    { value: "https://github.com/user/project-d", label: "project-d" },
    { value: "https://github.com/user/project-e", label: "project-e" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="repository" className="text-sm font-medium">
            GitHub Repository <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p>Select your GitHub repository from the dropdown</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Select
          value={formData.repository}
          onValueChange={(value) => handleChange("repository", value)}
        >
          <SelectTrigger
            className={`${errors.repository ? "border-destructive" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select a repository" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {repositories.map((repo) => (
              <SelectItem key={repo.value} value={repo.value}>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  {repo.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.repository && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.repository}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          This is the GitHub repository that contains your application code.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="branch" className="text-sm font-medium">
            Branch <span className="text-destructive">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Specify which branch to deploy (e.g., main, develop)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative">
          <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="branch"
            value={formData.branch}
            onChange={(e) => handleChange("branch", e.target.value)}
            placeholder="main"
            className={`pl-10 ${errors.branch ? "border-destructive" : ""}`}
          />
        </div>
        {errors.branch && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.branch}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          The branch that will be used for deployment. Common values are 'main'
          or 'master'.
        </p>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Make sure you have the necessary permissions to access this
          repository. You'll need admin or write access to set up webhooks.
        </AlertDescription>
      </Alert>
    </div>
  );
}
