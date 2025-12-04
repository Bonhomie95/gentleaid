import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import LandingPage from '../pages/home/LandingPage';
import CompleteProfilePage from '../pages/auth/CompleteProfilePage';
import GroupsPage from '../pages/groups/GroupsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import EmailLoginPage from '../pages/auth/EmailLoginPage';

export default function AppRouter() {
  const { hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading GentelAid...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<EmailLoginPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />

      {/* 🔐 PROTECTED ROUTES */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppProtectedRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Sub-Router for authenticated pages */
function AppProtectedRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="groups" replace />} />
      <Route path="groups" element={<GroupsPage />} />
      {/* Next additions: /app/profile, /app/help, /app/kyc */}
    </Routes>
  );
}
