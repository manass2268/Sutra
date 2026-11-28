import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  
  const isLocalTesting = import.meta.env.DEV;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03120F] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#20E875] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLocalTesting) {
    return <Outlet />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}