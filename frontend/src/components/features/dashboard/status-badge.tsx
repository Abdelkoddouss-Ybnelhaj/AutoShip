import { Badge } from "@/components/ui/badge";
import type { DeploymentStatus } from "@/types/deployment";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RotateCcw,
  GitMerge,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: DeploymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: DeploymentStatus) => {
    switch (status) {
      case "queued":
        return {
          label: "Queued",
          variant: "outline" as const,
          icon: <Clock className="h-3 w-3 mr-1" />,
          className:
            "text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800",
        };
      case "building":
        return {
          label: "Building",
          variant: "outline" as const,
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
          className:
            "text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800",
        };
      case "deploying":
        return {
          label: "Deploying",
          variant: "outline" as const,
          icon: <GitMerge className="h-3 w-3 mr-1" />,
          className:
            "text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800",
        };
      case "success":
        return {
          label: "Success",
          variant: "outline" as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          className:
            "text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800",
        };
      case "failed":
        return {
          label: "Failed",
          variant: "outline" as const,
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className:
            "text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800",
        };
      case "canceled":
        return {
          label: "Canceled",
          variant: "outline" as const,
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          className:
            "text-gray-600 border-gray-300 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700",
        };
      case "rollback":
        return {
          label: "Rolled Back",
          variant: "outline" as const,
          icon: <RotateCcw className="h-3 w-3 mr-1" />,
          className:
            "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800",
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          icon: null,
          className: "",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
