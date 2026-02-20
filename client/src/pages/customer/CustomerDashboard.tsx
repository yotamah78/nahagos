import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { usePolling } from '../../hooks/usePolling';
import { getMyRequests } from '../../services/requests.service';
import type { ServiceRequest } from '../../services/requests.service';
import { formatDate } from '../../utils/format';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await getMyRequests();
      setRequests(data);
    } catch {
      setError('שגיאה בטעינת הבקשות');
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchRequests, Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 30000);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-black text-brand-black tracking-tight">
            שלום, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-brand-gray font-medium mt-0.5">הבקשות שלי</p>
        </div>
        <Link to="/requests/new" className="btn-primary flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span>
          בקשה חדשה
        </Link>
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 font-medium">{error}</div>
      )}

      {!loading && requests.length === 0 && (
        <div className="card text-center py-16">
          <svg viewBox="0 0 80 55" className="w-20 mx-auto mb-4 opacity-15" fill="none">
            <rect x="5" y="28" width="70" height="20" rx="5" fill="#0a0a0a"/>
            <path d="M15 28 L22 16 L58 16 L65 28 Z" fill="#0a0a0a"/>
            <circle cx="22" cy="48" r="8" fill="#0a0a0a"/>
            <circle cx="58" cy="48" r="8" fill="#0a0a0a"/>
          </svg>
          <h3 className="text-xl font-black text-brand-black">אין בקשות עדיין</h3>
          <p className="text-brand-gray font-medium mt-2 mb-5 max-w-xs mx-auto">
            צור בקשה וקבל הצעות מחיר מנהגים מאומתים
          </p>
          <Link to="/requests/new" className="btn-primary inline-flex">צור בקשה עכשיו</Link>
        </div>
      )}

      <div className="space-y-3">
        {requests.map(req => (
          <Link key={req.id} to={`/requests/${req.id}`}>
            <div className="card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={req.status} />
                    {req._count && req._count.bids > 0 && (
                      <span className="text-xs font-semibold text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                        {req._count.bids} הצעות
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-brand-black truncate">
                    {req.carModel} &bull; {req.carPlateNumber}
                  </p>
                  <p className="text-sm text-brand-gray truncate mt-0.5 font-medium">
                    📍 {req.destinationAddress}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {formatDate(req.pickupDatetime)}
                  </p>
                </div>
                <div className="text-gray-300 text-xl font-bold mt-1">›</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
