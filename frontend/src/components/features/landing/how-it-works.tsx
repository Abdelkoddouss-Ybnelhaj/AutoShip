import type React from "react";
import { ArrowRight, Github, LayoutDashboard, Rocket } from "lucide-react";

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  showArrow?: boolean;
}

function StepCard({
  step,
  title,
  description,
  icon,
  showArrow = false,
}: StepCardProps) {
  return (
    <div className="relative">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 h-full">
        <div className="absolute -top-4 left-8 bg-sky-500 text-white text-sm font-bold py-1 px-3 rounded-full">
          {step}
        </div>
        <div className="mb-4 text-sky-500">{icon}</div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {showArrow && (
        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
          <ArrowRight className="h-8 w-8 text-slate-300 dark:text-slate-600" />
        </div>
      )}
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Connect",
      description:
        "Link your GitHub repositories to DeployDash with just a few clicks.",
      icon: <Github className="h-8 w-8" />,
    },
    {
      step: "02",
      title: "Configure",
      description:
        "Set up your deployment environments and customize your workflow.",
      icon: <LayoutDashboard className="h-8 w-8" />,
    },
    {
      step: "03",
      title: "Deploy",
      description:
        "Launch your applications with confidence and monitor performance in real-time.",
      icon: <Rocket className="h-8 w-8" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
              showArrow={index < steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
