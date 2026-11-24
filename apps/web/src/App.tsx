import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
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
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Modular Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Main Dashboard ab seedha Direct Chat open karega */}
              <Route path="/dashboard" element={<ChatsPage defaultFilter="All" />} />
              <Route path="/dashboard/chats" element={<ChatsPage defaultFilter="All" />} />

              {/* Sidebar Overview Route */}
              <Route path="/dashboard/overview" element={<OverviewPage />} />

              <Route path="/dashboard/contacts" element={<ContactsPage />} />
              <Route path="/dashboard/groups" element={<ChatsPage defaultFilter="Groups" />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/support" element={<SupportPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Analytics />
    </AuthProvider>
  );
}

export default App;