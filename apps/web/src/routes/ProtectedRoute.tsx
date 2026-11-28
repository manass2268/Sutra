import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const auth = useAuth() as { user: any; loading?: boolean };

  // Jab tak Firebase session check ho raha hai, login page par redirect mat karo
  if (auth.loading) {
    return (
      <div className="h-screen w-full bg-[#040B0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00FF85] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}