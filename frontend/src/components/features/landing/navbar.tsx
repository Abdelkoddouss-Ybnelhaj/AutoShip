"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Rocket } from "lucide-react";

interface NavbarProps {
  login: () => void;
  isLoading: boolean;
}

export function Navbar({ login, isLoading }: NavbarProps) {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Rocket className="h-8 w-8 text-sky-500" />
            <span className="ml-2 text-xl font-bold">DeployDash</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Testimonials
            </a>
            <Button
              onClick={login}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="ml-4 gap-2"
            >
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <GitHubLogoIcon className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
