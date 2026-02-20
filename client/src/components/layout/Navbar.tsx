import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function CarIcon() {
  return (
    <svg width="26" height="16" viewBox="0 0 26 16" fill="none" className="shrink-0">
      <rect x="1" y="7" width="24" height="7" rx="2.5" fill="currentColor"/>
      <path d="M5 7 L8 2 L18 2 L21 7 Z" fill="currentColor" opacity="0.75"/>
      <circle cx="7.5" cy="14" r="3" fill="currentColor"/>
      <circle cx="18.5" cy="14" r="3" fill="currentColor"/>
      <circle cx="7.5" cy="14" r="1.2" fill="white"/>
      <circle cx="18.5" cy="14" r="1.2" fill="white"/>
    </svg>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardLink =
    user?.role === 'ADMIN'  ? '/admin' :
    user?.role === 'DRIVER' ? '/driver/dashboard' :
    '/dashboard';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={dashboardLink} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
          <CarIcon />
          <span className="text-xl font-black tracking-tight text-brand-black">CarRelay</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-brand-gray hidden sm:block">{user.name}</span>
            {user.role === 'ADMIN' && (
              <span className="badge-verified">מנהל</span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-brand-gray hover:text-red-600 transition-colors"
            >
              יציאה
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
