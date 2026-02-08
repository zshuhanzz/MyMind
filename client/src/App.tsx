import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import { useAuth } from './hooks/use-auth';
import CrisisBanner from './components/layout/crisis-banner';
import AppShell from './components/layout/app-shell';
import Spinner from './components/ui/spinner';

import LandingPage from './pages/landing-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import OnboardingPage from './pages/onboarding-page';
import DashboardPage from './pages/dashboard-page';
import ChatPage from './pages/chat-page';
import CheckInPage from './pages/check-in-page';
import JournalPage from './pages/journal-page';
import JournalEntryPage from './pages/journal-entry-page';
import SettingsPage from './pages/settings-page';
import ExportPage from './pages/export-page';
import PrivacyPage from './pages/privacy-page';
import NotFoundPage from './pages/not-found-page';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
        <Spinner size="lg" className="text-lavender-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warmgray-50">
        <Spinner size="lg" className="text-lavender-400" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - redirect to dashboard if logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Always accessible */}
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/new" element={<JournalEntryPage />} />
          <Route path="/journal/:id" element={<JournalEntryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CrisisBanner />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
