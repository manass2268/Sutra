import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Modular Dashboard Pages
import OverviewPage from './pages/dashboard/OverviewPage';
import ChatsPage from './pages/dashboard/ChatsPage';
import ContactsPage from './pages/dashboard/ContactsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import SupportPage from './pages/dashboard/SupportPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes: Logged-in user ko seedha /dashboard (Chats) par bhejenge */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Dashboard Nested Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<ChatsPage key="chats-main" defaultFilter="All" />} />
              <Route path="chats" element={<ChatsPage key="chats-tab" defaultFilter="All" />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="groups" element={<ChatsPage key="chats-groups" defaultFilter="Groups" />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Analytics />
    </AuthProvider>
  );
}

export default App;