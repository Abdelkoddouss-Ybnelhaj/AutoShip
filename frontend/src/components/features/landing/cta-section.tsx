"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Github } from "lucide-react";

interface CTASectionProps {
  login: () => void;
  isLoading: boolean;
}

export function CTASection({ login, isLoading }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Ready to simplify your deployments?
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of developers who are shipping faster and with more
          confidence using DeployDash.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={login}
            disabled={isLoading}
            size="lg"
            variant="secondary"
            className="gap-2"
          >
            {isLoading ? (
              <Spinner className="h-5 w-5" />
            ) : (
              <>
                <Github className="h-5 w-5" />
                Get Started for Free
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white/10"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
