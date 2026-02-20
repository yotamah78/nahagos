import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../../components/ui/Spinner';

export function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) return <Navigate to="/welcome" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DRIVER') return <Navigate to="/driver/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}
