import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard/dashboard";
import DeploymentsPage from "@/pages/dashboard/deployments/deployment";
import NewDeploymentPage from "@/pages/dashboard/deployments/new";
import DeploymentDetailsPage from "@/pages/dashboard/deployments/[id]";
import ServersPage from "@/pages/dashboard/servers";
import AnalyticsPage from "@/pages/dashboard/analytics";
import SettingsPage from "@/pages/dashboard/settings";
import TeamPage from "@/pages/dashboard/team";
import HistoryPage from "@/pages/dashboard/history";
import PullRequestsPage from "@/pages/dashboard/pull-requests";
import AuthRedirectHandler from "@/utils/AuthRedirectHandler";
import ProtectedRoute from "@/utils/ProtectedRoute";
import DashboardLayout from "@/layouts/dashboard/layout";
// import "@/styles/globals.css";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthRedirectHandler />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Dashboard routes with DashboardLayout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="deployments" element={<DeploymentsPage />} />
              <Route path="deployments/new" element={<NewDeploymentPage />} />
              <Route
                path="deployments/:id"
                element={<DeploymentDetailsPage />}
              />
              <Route path="servers" element={<ServersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="pull-requests" element={<PullRequestsPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
