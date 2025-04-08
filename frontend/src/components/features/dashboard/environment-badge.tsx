import { Badge } from "@/components/ui/badge";
import type { Environment } from "@/types/deployment";
import { cn } from "@/lib/utils";
import { Globe, Server, Laptop, Beaker } from "lucide-react";

interface EnvironmentBadgeProps {
  environment: Environment;
  className?: string;
}

export function EnvironmentBadge({
  environment,
  className,
}: EnvironmentBadgeProps) {
  const getEnvironmentConfig = (env: Environment) => {
    switch (env) {
      case "production":
        return {
          label: "Production",
          icon: <Globe className="h-3 w-3 mr-1" />,
          className:
            "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300",
        };
      case "staging":
        return {
          label: "Staging",
          icon: <Server className="h-3 w-3 mr-1" />,
          className:
            "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300",
        };
      case "development":
        return {
          label: "Development",
          icon: <Laptop className="h-3 w-3 mr-1" />,
          className:
            "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300",
        };
      case "testing":
        return {
          label: "Testing",
          icon: <Beaker className="h-3 w-3 mr-1" />,
          className:
            "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300",
        };
      default:
        return {
          label: environment,
          icon: null,
          className: "",
        };
    }
  };

  const config = getEnvironmentConfig(environment);

  return (
    <Badge
      variant="secondary"
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
