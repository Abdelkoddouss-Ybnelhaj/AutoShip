import type React from "react";
import { BarChart3, Code2, Github, Globe, RefreshCcw, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="bg-white dark:bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Github className="h-6 w-6 text-sky-500" />,
      title: "GitHub Integration",
      description:
        "Connect your repositories and deploy directly from your GitHub workflow with automated CI/CD pipelines.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-sky-500" />,
      title: "Real-Time Logs",
      description:
        "Monitor your deployments in real-time with detailed logs and performance metrics.",
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-sky-500" />,
      title: "One-Click Rollback",
      description:
        "Instantly revert to previous versions when issues arise, minimizing downtime.",
    },
    {
      icon: <Globe className="h-6 w-6 text-sky-500" />,
      title: "Multi-Environment Support",
      description:
        "Manage development, staging, and production environments from a single dashboard.",
    },
    {
      icon: <Zap className="h-6 w-6 text-sky-500" />,
      title: "Performance Monitoring",
      description:
        "Track application performance and receive alerts when metrics fall outside expected ranges.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-sky-500" />,
      title: "Custom Deployment Scripts",
      description:
        "Create and manage custom deployment scripts to fit your specific workflow needs.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need for seamless deployments
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Our platform provides all the tools you need to deploy, monitor, and
            manage your applications with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
