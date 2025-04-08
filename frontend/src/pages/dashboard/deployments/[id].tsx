"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDeployment,
  getDeploymentLogs,
  rollbackDeployment,
} from "@/lib/api";
import type { Deployment, DeploymentLog } from "@/types/";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Copy,
  ExternalLink,
  GitBranch,
  GitCommit,
  RotateCcw,
  Share2,
  Terminal,
  Timer,
  User,
} from "lucide-react";
import { StatusBadge } from "@/components/features/dashboard/status-badge";
import { EnvironmentBadge } from "@/components/features/dashboard/environment-badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeploymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDeployment() {
      if (!id) return;

      try {
        const data = await getDeployment(id);
        setDeployment(data);
      } catch (error) {
        console.error("Failed to fetch deployment:", error);
        toast({
          title: "Error",
          description: "Failed to load deployment details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDeployment();
  }, [id, toast]);

  useEffect(() => {
    async function fetchLogs() {
      if (!deployment) return;

      try {
        const data = await getDeploymentLogs(deployment.id);
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    }

    fetchLogs();

    // Set up polling for logs if deployment is in progress
    if (
      deployment &&
      ["queued", "building", "deploying"].includes(deployment.status)
    ) {
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [deployment]);

  useEffect(() => {
    // Scroll to bottom of logs when new logs are added
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleRollback = async () => {
    if (!deployment) return;

    setRollingBack(true);

    try {
      await rollbackDeployment(deployment.id);
      toast({
        title: "Rollback Initiated",
        description: "The deployment is being rolled back.",
      });
      // Refresh deployment data
      if (id) {
        const updatedDeployment = await getDeployment(id);
        setDeployment(updatedDeployment);
      }
    } catch (error) {
      console.error("Failed to rollback deployment:", error);
      toast({
        title: "Error",
        description: "Failed to rollback deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRollingBack(false);
    }
  };

  const copyDeploymentUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Deployment URL copied to clipboard.",
    });
  };

  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading deployment details...
          </p>
        </div>
      </div>
    );
  }

  if (!deployment) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Deployment not found. It may have been deleted or you don't have
            permission to view it.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Deployment Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyDeploymentUrl}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Collaborator</DialogTitle>
                <DialogDescription>
                  Invite a team member to collaborate on this deployment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" placeholder="colleague@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Permission level</Label>
                  <select
                    id="role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="viewer">Viewer (can view only)</option>
                    <option value="editor">Editor (can edit settings)</option>
                    <option value="admin">Admin (full control)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRollback}
            disabled={rollingBack || deployment.status === "rollback"}
          >
            {rollingBack ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Rollback
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {deployment.repositoryName}
                    <StatusBadge status={deployment.status} />
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {deployment.commitMessage}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={deployment.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Repository
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Branch</div>
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{deployment.branch}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Commit</div>
                  <div className="flex items-center">
                    <GitCommit className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-mono">
                      {deployment.commitHash.substring(0, 7)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Environment
                  </div>
                  <div>
                    <EnvironmentBadge environment={deployment.environment} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Triggered By
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{deployment.triggeredBy.name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Timestamp</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span
                      title={format(new Date(deployment.timestamp), "PPpp")}
                    >
                      {formatDistanceToNow(new Date(deployment.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {deployment.duration
                        ? `${deployment.duration} seconds`
                        : "In progress"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="logs">
                <TabsList>
                  <TabsTrigger value="logs">Deployment Logs</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                </TabsList>
                <TabsContent value="logs" className="space-y-4">
                  <div className="relative">
                    <div className="absolute right-2 top-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            logs.map((log) => log.message).join("\n")
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-black text-white font-mono text-sm p-4 rounded-md h-[400px] overflow-y-auto">
                      {logs.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <Terminal className="h-5 w-5 mr-2" />
                          No logs available yet
                        </div>
                      ) : (
                        logs.map((log) => (
                          <div key={log.id} className="pb-1">
                            <span className="text-gray-500">
                              [{format(new Date(log.timestamp), "HH:mm:ss")}]
                            </span>{" "}
                            <span className={getLogLevelStyle(log.level)}>
                              {log.message}
                            </span>
                          </div>
                        ))
                      )}
                      <div ref={logsEndRef} />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="config">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Event Type</h3>
                      <p className="text-sm mt-1 capitalize">
                        {deployment.eventType.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Commands</h3>
                      <div className="bg-muted p-3 rounded-md mt-1 font-mono text-xs">
                        <div>$ npm ci</div>
                        <div>$ npm run build</div>
                        <div>$ npm start</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <StatusBadge status={deployment.status} />
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        deployment.status === "failed"
                          ? "bg-red-500"
                          : deployment.status === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width:
                          deployment.status === "success"
                            ? "100%"
                            : deployment.status === "failed"
                            ? "100%"
                            : deployment.status === "building"
                            ? "30%"
                            : deployment.status === "deploying"
                            ? "70%"
                            : "10%",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Queued</span>
                    <span>Building</span>
                    <span>Deploying</span>
                    <span>Complete</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs
                  .filter(
                    (log) =>
                      log.level === "success" ||
                      log.level === "error" ||
                      log.level === "warning"
                  )
                  .slice(-5)
                  .map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          log.level === "error"
                            ? "bg-red-500"
                            : log.level === "warning"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm">{log.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                {logs.filter(
                  (log) =>
                    log.level === "success" ||
                    log.level === "error" ||
                    log.level === "warning"
                ).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No significant events yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Previous deployment</div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="text-sm">Next deployment</div>
                  <Button variant="ghost" size="sm" disabled>
                    None
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate("/dashboard/deployments")}
              >
                View All Deployments
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
