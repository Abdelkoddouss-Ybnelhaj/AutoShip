import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PricingPlanProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

function PricingPlan({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
}: PricingPlanProps) {
  return (
    <div
      className={`bg-slate-50 dark:bg-slate-800 rounded-lg border ${
        popular
          ? "border-sky-500 dark:border-sky-500 shadow-lg relative"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-sky-500 text-white text-xs font-bold py-1 px-3 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          {name}
        </h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {price}
          </span>
          {period && (
            <span className="text-slate-500 dark:text-slate-400">{period}</span>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>
        <Button
          className={`w-full mb-6 ${
            popular
              ? ""
              : "bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          }`}
          variant={popular ? "default" : "outline"}
        >
          {cta}
        </Button>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-sky-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for personal projects and small teams",
      features: [
        "Up to 3 repositories",
        "Basic GitHub integration",
        "5 deployments per day",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Everything you need for growing teams",
      features: [
        "Unlimited repositories",
        "Advanced GitHub integration",
        "Unlimited deployments",
        "One-click rollbacks",
        "Real-time logs",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Pro",
        "Custom deployment scripts",
        "Advanced security features",
        "Dedicated support",
        "SLA guarantees",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Choose the plan that's right for your team
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
