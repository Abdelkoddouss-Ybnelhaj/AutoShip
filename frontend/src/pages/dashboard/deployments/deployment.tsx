import { DeploymentsOverview } from "@/components/features/dashboard/deployments-overview";

export default function DeploymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Deployments</h1>
      <DeploymentsOverview />
    </div>
  );
}
