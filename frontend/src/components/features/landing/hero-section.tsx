"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, Play } from "lucide-react";

interface HeroSectionProps {
  login: () => void;
  isLoading: boolean;
}

export function HeroSection({ login, isLoading }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-5">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300"
            >
              New: One-click rollbacks now available
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              Simplify Your{" "}
              <span className="text-sky-600 dark:text-sky-500">
                Deployments
              </span>{" "}
              with GitHub Automation
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-3xl">
              Deploy faster, monitor smarter, and rollback instantly. The
              complete deployment dashboard for modern development teams.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={login}
                disabled={isLoading}
                size="lg"
                className="gap-2"
              >
                {isLoading ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <>
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </>
                )}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Product Demo</DialogTitle>
                    <DialogDescription>
                      See how DeployDash can streamline your deployment workflow
                    </DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                    <Play className="h-16 w-16 text-slate-400" />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              No credit card required • Free plan available • Cancel anytime
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 opacity-10 blur-3xl h-64 w-full rounded-full"></div>
              </div>
              <div className="relative shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="bg-white dark:bg-slate-800 h-8 flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Dashboard Preview"
                    className="rounded-md shadow-sm border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
