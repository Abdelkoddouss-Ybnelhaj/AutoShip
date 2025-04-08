import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQTabProps {
  faqs: FAQItem[];
}

function FAQTab({ faqs }: FAQTabProps) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{faq.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{faq.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FAQSection() {
  const generalFAQs = [
    {
      question: "What is DeployDash?",
      answer:
        "DeployDash is a deployment management platform that integrates with GitHub to provide automated deployments, monitoring, and rollback capabilities for your applications.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign in with your GitHub account, connect your repositories, and configure your deployment settings. Our setup wizard will guide you through the process.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes, we offer a free Starter plan that includes basic features for personal projects and small teams.",
    },
  ];

  const technicalFAQs = [
    {
      question: "Which GitHub events can trigger deployments?",
      answer:
        "DeployDash can trigger deployments on push events, pull request events, release events, and manual triggers.",
    },
    {
      question: "Can I use custom deployment scripts?",
      answer:
        "Yes, Pro and Enterprise plans support custom deployment scripts written in Bash, JavaScript, or Python.",
    },
    {
      question: "Does DeployDash support monorepos?",
      answer:
        "Yes, DeployDash has built-in support for monorepos with the ability to configure different deployment settings for different parts of your repository.",
    },
  ];

  const billingFAQs = [
    {
      question: "How does billing work?",
      answer:
        "We offer monthly and annual billing options. Annual billing comes with a 20% discount compared to monthly billing.",
    },
    {
      question: "Can I change plans at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about DeployDash
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <FAQTab faqs={generalFAQs} />
          </TabsContent>
          <TabsContent value="technical">
            <FAQTab faqs={technicalFAQs} />
          </TabsContent>
          <TabsContent value="billing">
            <FAQTab faqs={billingFAQs} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
