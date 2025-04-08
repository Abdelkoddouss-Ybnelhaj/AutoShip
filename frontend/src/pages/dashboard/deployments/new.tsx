"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDeployment, getRepositories, getBranches } from "@/lib/api";
import type {
  Repository,
  Branch,
  Environment,
  EventType,
  DeploymentConfig,
} from "@/types/deployment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, GitBranch, Info, Rocket, Server } from "lucide-react";

export default function NewDeploymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    repositoryId: "",
    branch: "",
    environment: "staging",
    eventTypes: ["push"],
    commands: ["npm ci", "npm run build", "npm start"],
    autoRollback: true,
    notifyOnSuccess: true,
    notifyOnFailure: true,
  });

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const data = await getRepositories();
        setRepositories(data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        toast({
          title: "Error",
          description: "Failed to load repositories. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, [toast]);

  useEffect(() => {
    async function fetchBranches() {
      if (!deploymentConfig.repositoryId) {
        setBranches([]);
        return;
      }

      try {
        const data = await getBranches(deploymentConfig.repositoryId);
        setBranches(data);

        // Auto-select the first branch if none is selected
        if (data.length > 0 && !deploymentConfig.branch) {
          setDeploymentConfig((prev) => ({
            ...prev,
            branch: data[0].name,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast({
          title: "Error",
          description: "Failed to load branches. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchBranches();
  }, [deploymentConfig.repositoryId, toast]);

  const handleRepositoryChange = (repositoryId: string) => {
    setDeploymentConfig((prev) => ({
      ...prev,
      repositoryId,
      branch: "", // Reset branch when repository changes
    }));
  };

  const handleBranchChange = (branch: string) => {
    setDeploymentConfig((prev) => ({
      ...prev,
      branch,
    }));
  };

  const handleEnvironmentChange = (environment: Environment) => {
    setDeploymentConfig((prev) => ({
      ...prev,
      environment,
    }));
  };

  const handleEventTypeToggle = (eventType: EventType) => {
    setDeploymentConfig((prev) => {
      const eventTypes = prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter((type) => type !== eventType)
        : [...prev.eventTypes, eventType];

      return {
        ...prev,
        eventTypes,
      };
    });
  };

  const handleCommandsChange = (commands: string) => {
    setDeploymentConfig((prev) => ({
      ...prev,
      commands: commands.split("\n").filter((cmd) => cmd.trim() !== ""),
    }));
  };

  const handleSubmit = async () => {
    if (!deploymentConfig.repositoryId || !deploymentConfig.branch) {
      toast({
        title: "Validation Error",
        description: "Please select a repository and branch.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const deployment = await createDeployment(deploymentConfig);
      toast({
        title: "Deployment Created",
        description: "Your deployment has been queued successfully.",
      });
      navigate(`/dashboard/deployments/${deployment.id}`);
    } catch (error) {
      console.error("Failed to create deployment:", error);
      toast({
        title: "Error",
        description: "Failed to create deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRepository = repositories.find(
    (repo) => repo.id === deploymentConfig.repositoryId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Deployment</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Configuration</CardTitle>
              <CardDescription>
                Configure your deployment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repository">Repository</Label>
                  <Select
                    value={deploymentConfig.repositoryId}
                    onValueChange={handleRepositoryChange}
                    disabled={loading}
                  >
                    <SelectTrigger id="repository" className="mt-1">
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {repositories.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          {repo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={deploymentConfig.branch}
                    onValueChange={handleBranchChange}
                    disabled={
                      !deploymentConfig.repositoryId || branches.length === 0
                    }
                  >
                    <SelectTrigger id="branch" className="mt-1">
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.name} value={branch.name}>
                          <div className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                            {branch.name}
                            {branch.protected && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                Protected
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRepository && deploymentConfig.branch && (
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center text-sm">
                      <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Latest Commit:</span>
                      <span className="ml-2 font-mono">
                        {branches
                          .find((b) => b.name === deploymentConfig.branch)
                          ?.lastCommitHash.substring(0, 7)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {
                        branches.find((b) => b.name === deploymentConfig.branch)
                          ?.lastCommitMessage
                      }
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="environment">Target Environment</Label>
                <Select
                  value={deploymentConfig.environment}
                  onValueChange={(value) =>
                    handleEnvironmentChange(value as Environment)
                  }
                >
                  <SelectTrigger id="environment" className="mt-1">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-red-500" />
                        Production
                      </div>
                    </SelectItem>
                    <SelectItem value="staging">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-purple-500" />
                        Staging
                      </div>
                    </SelectItem>
                    <SelectItem value="development">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-blue-500" />
                        Development
                      </div>
                    </SelectItem>
                    <SelectItem value="testing">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-green-500" />
                        Testing
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Trigger Events</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-push"
                      checked={deploymentConfig.eventTypes.includes("push")}
                      onCheckedChange={() => handleEventTypeToggle("push")}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-push"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Push
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Deploy when code is pushed to the branch
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-pull-request"
                      checked={deploymentConfig.eventTypes.includes(
                        "pull_request"
                      )}
                      onCheckedChange={() =>
                        handleEventTypeToggle("pull_request")
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-pull-request"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Pull Request
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Deploy when a pull request is opened or updated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-manual"
                      checked={deploymentConfig.eventTypes.includes("manual")}
                      onCheckedChange={() => handleEventTypeToggle("manual")}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-manual"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Manual
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Deploy only when manually triggered
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-scheduled"
                      checked={deploymentConfig.eventTypes.includes(
                        "scheduled"
                      )}
                      onCheckedChange={() => handleEventTypeToggle("scheduled")}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-scheduled"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Scheduled
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Deploy on a regular schedule
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="commands">Deployment Commands</Label>
                <Tabs defaultValue="commands">
                  <TabsList>
                    <TabsTrigger value="commands">Commands</TabsTrigger>
                    <TabsTrigger value="script">Script</TabsTrigger>
                  </TabsList>
                  <TabsContent value="commands" className="space-y-3">
                    <Textarea
                      id="commands"
                      placeholder="Enter deployment commands (one per line)"
                      className="font-mono text-sm"
                      rows={5}
                      value={deploymentConfig.commands.join("\n")}
                      onChange={(e) => handleCommandsChange(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter each command on a new line. These commands will be
                      executed in order during deployment.
                    </p>
                  </TabsContent>
                  <TabsContent value="script">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Advanced script configuration is available in the
                        settings page.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Additional Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-rollback"
                      checked={deploymentConfig.autoRollback}
                      onCheckedChange={(checked) =>
                        setDeploymentConfig((prev) => ({
                          ...prev,
                          autoRollback: checked === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="auto-rollback"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Auto-rollback on failure
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-success"
                      checked={deploymentConfig.notifyOnSuccess}
                      onCheckedChange={(checked) =>
                        setDeploymentConfig((prev) => ({
                          ...prev,
                          notifyOnSuccess: checked === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="notify-success"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Notify on successful deployment
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-failure"
                      checked={deploymentConfig.notifyOnFailure}
                      onCheckedChange={(checked) =>
                        setDeploymentConfig((prev) => ({
                          ...prev,
                          notifyOnFailure: checked === true,
                        }))
                      }
                    />
                    <label
                      htmlFor="notify-failure"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Notify on failed deployment
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Repository</dt>
                    <dd className="font-medium">
                      {selectedRepository?.name || "Not selected"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Branch</dt>
                    <dd className="font-medium">
                      {deploymentConfig.branch || "Not selected"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Environment</dt>
                    <dd className="font-medium capitalize">
                      {deploymentConfig.environment}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Trigger Events</dt>
                    <dd className="font-medium">
                      {deploymentConfig.eventTypes.length > 0
                        ? deploymentConfig.eventTypes.map((type) => (
                            <span
                              key={type}
                              className="inline-block bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs mr-1 mb-1"
                            >
                              {type.replace("_", " ")}
                            </span>
                          ))
                        : "None selected"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Commands</dt>
                    <dd className="font-mono text-xs bg-muted p-2 rounded-md mt-1">
                      {deploymentConfig.commands.map((cmd, i) => (
                        <div key={i} className="pb-1">
                          $ {cmd}
                        </div>
                      ))}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Deployment Information</AlertTitle>
              <AlertDescription>
                <p className="text-sm mt-2">
                  This deployment will be executed on the selected environment.
                  Make sure you have the necessary permissions.
                </p>
                <p className="text-sm mt-2">
                  For production deployments, additional approval may be
                  required.
                </p>
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>
                    <a href="#" className="text-primary hover:underline">
                      View deployment documentation
                    </a>
                  </p>
                  <p>
                    <a href="#" className="text-primary hover:underline">
                      Deployment best practices
                    </a>
                  </p>
                  <p>
                    <a href="#" className="text-primary hover:underline">
                      Contact support
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
