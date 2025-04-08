"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeployments } from "@/lib/api";
import type { Deployment } from "@/types/deployment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Eye,
  GitBranch,
  GitCommit,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { StatusBadge } from "./status-badge";
import { EnvironmentBadge } from "./environment-badge";
import { formatDistanceToNow } from "date-fns";

export function DeploymentsOverview() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Deployment>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchDeployments() {
      try {
        const data = await getDeployments();
        setDeployments(data);
      } catch (error) {
        console.error("Failed to fetch deployments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeployments();
  }, []);

  const handleSort = (field: keyof Deployment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredDeployments = deployments.filter(
    (deployment) =>
      deployment.repositoryName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      deployment.commitHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deployment.commitMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDeployments = [...filteredDeployments].sort((a, b) => {
    if (sortField === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const refreshData = () => {
    setLoading(true);
    getDeployments().then((data) => {
      setDeployments(data);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deployments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/dashboard/deployments/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Deployment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>
            View and manage all your deployment activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[250px] cursor-pointer"
                  onClick={() => handleSort("repositoryName")}
                >
                  <div className="flex items-center">
                    Repository
                    {sortField === "repositoryName" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("branch")}
                >
                  <div className="flex items-center">
                    Branch
                    {sortField === "branch" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("commitHash")}
                >
                  <div className="flex items-center">
                    Commit
                    {sortField === "commitHash" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("environment")}
                >
                  <div className="flex items-center">
                    Environment
                    {sortField === "environment" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                >
                  <div className="flex items-center">
                    Time
                    {sortField === "timestamp" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading deployments...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedDeployments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No deployments found. Create your first deployment.
                  </TableCell>
                </TableRow>
              ) : (
                sortedDeployments.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell>
                      <div className="font-medium">
                        {deployment.repositoryName}
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {deployment.commitMessage}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{deployment.branch}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GitCommit className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {deployment.commitHash.substring(0, 7)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <EnvironmentBadge environment={deployment.environment} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={deployment.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(deployment.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/dashboard/deployments/${deployment.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/deployments/${deployment.id}`
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Repository
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Rollback
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
