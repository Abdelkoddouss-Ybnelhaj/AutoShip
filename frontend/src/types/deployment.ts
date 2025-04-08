export type DeploymentStatus =
  | "queued"
  | "building"
  | "deploying"
  | "success"
  | "failed"
  | "canceled"
  | "rollback";

export type Environment = "production" | "staging" | "development" | "testing";

export type EventType =
  | "push"
  | "pull_request"
  | "manual"
  | "scheduled"
  | "tag";

export interface Deployment {
  id: string;
  repositoryName: string;
  repositoryUrl: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  status: DeploymentStatus;
  environment: Environment;
  timestamp: string;
  duration?: number;
  triggeredBy: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  eventType: EventType;
}

export interface DeploymentLog {
  id: string;
  deploymentId: string;
  timestamp: string;
  message: string;
  level: "info" | "warning" | "error" | "success";
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  branches: Branch[];
}

export interface Branch {
  name: string;
  lastCommitHash: string;
  lastCommitMessage: string;
  lastCommitAuthor: string;
  protected: boolean;
}

export interface DeploymentConfig {
  repositoryId: string;
  branch: string;
  environment: Environment;
  eventTypes: EventType[];
  commands: string[];
  autoRollback: boolean;
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
}
