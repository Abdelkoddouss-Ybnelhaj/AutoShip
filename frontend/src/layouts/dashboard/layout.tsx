import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
  return (
    <DashboardSidebar>
      <div className="container mx-auto max-w-7xl">
        <Outlet />
      </div>
    </DashboardSidebar>
  );
}
