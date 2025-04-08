import type {
  Branch,
  Deployment,
  DeploymentConfig,
  DeploymentLog,
  Repository,
} from "@/types/deployment";

// Mock data for the dashboard
const mockDeployments: Deployment[] = [
  {
    id: "dep-1",
    repositoryName: "frontend-app",
    repositoryUrl: "https://github.com/company/frontend-app",
    branch: "main",
    commitHash: "8f7e9d6",
    commitMessage: "Fix responsive layout issues on mobile",
    status: "success",
    environment: "production",
    timestamp: "2023-11-15T14:32:00Z",
    duration: 245,
    triggeredBy: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "push",
  },
  {
    id: "dep-2",
    repositoryName: "backend-api",
    repositoryUrl: "https://github.com/company/backend-api",
    branch: "develop",
    commitHash: "3a1b5c7",
    commitMessage: "Implement user authentication endpoints",
    status: "building",
    environment: "staging",
    timestamp: "2023-11-15T15:45:00Z",
    triggeredBy: {
      name: "John Doe",
      email: "john@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "pull_request",
  },
  {
    id: "dep-3",
    repositoryName: "data-service",
    repositoryUrl: "https://github.com/company/data-service",
    branch: "feature/analytics",
    commitHash: "2c4e6f8",
    commitMessage: "Add real-time analytics processing",
    status: "failed",
    environment: "development",
    timestamp: "2023-11-15T13:20:00Z",
    duration: 178,
    triggeredBy: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "manual",
  },
  {
    id: "dep-4",
    repositoryName: "frontend-app",
    repositoryUrl: "https://github.com/company/frontend-app",
    branch: "feature/dark-mode",
    commitHash: "9d8c7b6",
    commitMessage: "Implement dark mode toggle",
    status: "deploying",
    environment: "staging",
    timestamp: "2023-11-15T16:10:00Z",
    triggeredBy: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "push",
  },
  {
    id: "dep-5",
    repositoryName: "infrastructure",
    repositoryUrl: "https://github.com/company/infrastructure",
    branch: "main",
    commitHash: "5e7d9f1",
    commitMessage: "Update Kubernetes configuration",
    status: "queued",
    environment: "production",
    timestamp: "2023-11-15T16:30:00Z",
    triggeredBy: {
      name: "Mike Brown",
      email: "mike@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "scheduled",
  },
  {
    id: "dep-6",
    repositoryName: "backend-api",
    repositoryUrl: "https://github.com/company/backend-api",
    branch: "main",
    commitHash: "1a3c5e7",
    commitMessage: "Optimize database queries",
    status: "rollback",
    environment: "production",
    timestamp: "2023-11-15T12:15:00Z",
    duration: 320,
    triggeredBy: {
      name: "Chris Taylor",
      email: "chris@example.com",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    eventType: "manual",
  },
];

const mockRepositories: Repository[] = [
  {
    id: "repo-1",
    name: "frontend-app",
    url: "https://github.com/company/frontend-app",
    branches: [
      {
        name: "main",
        lastCommitHash: "8f7e9d6",
        lastCommitMessage: "Fix responsive layout issues on mobile",
        lastCommitAuthor: "Jane Smith",
        protected: true,
      },
      {
        name: "develop",
        lastCommitHash: "7e6d5c4",
        lastCommitMessage: "Add new dashboard components",
        lastCommitAuthor: "John Doe",
        protected: false,
      },
      {
        name: "feature/dark-mode",
        lastCommitHash: "9d8c7b6",
        lastCommitMessage: "Implement dark mode toggle",
        lastCommitAuthor: "Sarah Williams",
        protected: false,
      },
    ],
  },
  {
    id: "repo-2",
    name: "backend-api",
    url: "https://github.com/company/backend-api",
    branches: [
      {
        name: "main",
        lastCommitHash: "1a3c5e7",
        lastCommitMessage: "Optimize database queries",
        lastCommitAuthor: "Chris Taylor",
        protected: true,
      },
      {
        name: "develop",
        lastCommitHash: "3a1b5c7",
        lastCommitMessage: "Implement user authentication endpoints",
        lastCommitAuthor: "John Doe",
        protected: false,
      },
    ],
  },
  {
    id: "repo-3",
    name: "data-service",
    url: "https://github.com/company/data-service",
    branches: [
      {
        name: "main",
        lastCommitHash: "4b6d8f0",
        lastCommitMessage: "Update data processing pipeline",
        lastCommitAuthor: "Mike Brown",
        protected: true,
      },
      {
        name: "feature/analytics",
        lastCommitHash: "2c4e6f8",
        lastCommitMessage: "Add real-time analytics processing",
        lastCommitAuthor: "Alex Johnson",
        protected: false,
      },
    ],
  },
];

const mockLogs: Record<string, DeploymentLog[]> = {
  "dep-1": Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i}`,
    deploymentId: "dep-1",
    timestamp: new Date(Date.now() - (50 - i) * 30000).toISOString(),
    message:
      i === 49
        ? "Deployment completed successfully"
        : `Executing step ${i + 1}: ${getRandomLogMessage(i)}`,
    level: i === 49 ? "success" : i % 10 === 5 ? "warning" : "info",
  })),
  "dep-3": Array.from({ length: 30 }, (_, i) => ({
    id: `log-${i}`,
    deploymentId: "dep-3",
    timestamp: new Date(Date.now() - (30 - i) * 45000).toISOString(),
    message:
      i === 29
        ? "Deployment failed: Unable to connect to database"
        : `Executing step ${i + 1}: ${getRandomLogMessage(i)}`,
    level: i === 29 ? "error" : i % 8 === 4 ? "warning" : "info",
  })),
};

function getRandomLogMessage(step: number): string {
  const messages = [
    "Installing dependencies",
    "Running tests",
    "Building application",
    "Optimizing assets",
    "Preparing deployment package",
    "Uploading to server",
    "Updating configuration",
    "Restarting services",
    "Clearing cache",
    "Verifying deployment",
  ];
  return messages[step % messages.length];
}

// API functions
export async function getDeployments(): Promise<Deployment[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDeployments);
    }, 500);
  });
}

export async function getDeployment(id: string): Promise<Deployment | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const deployment = mockDeployments.find((d) => d.id === id) || null;
      resolve(deployment);
    }, 300);
  });
}

export async function getDeploymentLogs(
  deploymentId: string
): Promise<DeploymentLog[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLogs[deploymentId] || []);
    }, 300);
  });
}

export async function getRepositories(): Promise<Repository[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRepositories);
    }, 400);
  });
}

export async function getRepository(id: string): Promise<Repository | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const repository = mockRepositories.find((r) => r.id === id) || null;
      resolve(repository);
    }, 300);
  });
}

export async function getBranches(repositoryId: string): Promise<Branch[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const repository = mockRepositories.find((r) => r.id === repositoryId);
      resolve(repository?.branches || []);
    }, 300);
  });
}

export async function createDeployment(
  config: DeploymentConfig
): Promise<Deployment> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const repository = mockRepositories.find(
        (r) => r.id === config.repositoryId
      );
      const branch = repository?.branches.find((b) => b.name === config.branch);

      if (!repository || !branch) {
        throw new Error("Repository or branch not found");
      }

      const newDeployment: Deployment = {
        id: `dep-${Date.now()}`,
        repositoryName: repository.name,
        repositoryUrl: repository.url,
        branch: config.branch,
        commitHash: branch.lastCommitHash,
        commitMessage: branch.lastCommitMessage,
        status: "queued",
        environment: config.environment,
        timestamp: new Date().toISOString(),
        triggeredBy: {
          name: "Current User",
          email: "user@example.com",
          avatarUrl: "/placeholder.svg?height=40&width=40",
        },
        eventType: "manual",
      };

      resolve(newDeployment);
    }, 800);
  });
}

export async function rollbackDeployment(
  deploymentId: string
): Promise<boolean> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
