import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import LandingPage from '../pages/home/LandingPage';
import PhoneLoginPage from '../pages/auth/PhoneLoginPage';
import CompleteProfilePage from '../pages/auth/CompleteProfilePage';
import GroupsPage from '../pages/groups/GroupsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
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

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="groups" replace />} />
        <Route path="groups" element={<GroupsPage />} />
        {/* later: /app/groups/:id, /app/profile, /app/kyc, /app/help, etc */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
