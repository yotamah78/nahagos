import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Spinner } from '../../components/ui/Spinner';
import { getStats } from '../../services/admin.service';
import { formatCurrency } from '../../utils/format';

interface Stats {
  totalUsers: number;
  totalDrivers: number;
  pendingVerifications: number;
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'משתמשים רשומים', value: stats.totalUsers, icon: '👥', link: '/admin/users', highlight: false },
    { label: 'נהגים פעילים', value: stats.totalDrivers, icon: '🚗', link: '/admin/drivers', highlight: false },
    { label: 'ממתינים לאישור', value: stats.pendingVerifications, icon: '⏳', link: '/admin/drivers', highlight: stats.pendingVerifications > 0 },
    { label: 'משרות פעילות', value: stats.activeJobs, icon: '🔄', link: '/admin/requests', highlight: false },
    { label: 'משרות שהושלמו', value: stats.completedJobs, icon: '✅', link: '/admin/requests', highlight: false },
    { label: 'הכנסות פלטפורמה', value: formatCurrency(Number(stats.totalRevenue)), icon: '💰', link: '/admin/requests', highlight: false },
  ] : [];

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-black text-brand-black tracking-tight">פאנל ניהול</h1>
          <p className="text-brand-gray font-medium mt-0.5">סקירת מערכת בזמן אמת</p>
        </div>
        <span className="badge-verified text-sm px-3 py-1">ADMIN</span>
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {stats && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {cards.map(card => (
              <Link key={card.label} to={card.link}>
                <div className={`card cursor-pointer transition-all hover:border-gray-200 ${
                  card.highlight ? 'border-amber-300 bg-amber-50' : ''
                }`}>
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <div className={`text-2xl font-black ${card.highlight ? 'text-amber-700' : 'text-brand-black'}`}>
                    {card.value}
                  </div>
                  <div className="text-xs text-brand-gray font-medium mt-0.5">{card.label}</div>
                  {card.highlight && (
                    <div className="text-xs font-bold text-amber-600 mt-1">דורש פעולה ›</div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <h2 className="text-lg font-black text-brand-black mb-3">פעולות מהירות</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/admin/drivers">
              <div className={`card cursor-pointer transition-all py-6 text-center ${
                stats.pendingVerifications > 0
                  ? 'border-2 border-amber-300 bg-amber-50 hover:border-amber-400'
                  : 'hover:border-gray-200'
              }`}>
                <div className="text-4xl mb-3">🪪</div>
                <div className="font-black text-brand-black">אישור נהגים</div>
                {stats.pendingVerifications > 0 ? (
                  <div className="inline-block mt-2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {stats.pendingVerifications} ממתינים
                  </div>
                ) : (
                  <div className="text-sm text-brand-gray font-medium mt-1">הכל מעודכן ✓</div>
                )}
              </div>
            </Link>
            <Link to="/admin/requests">
              <div className="card cursor-pointer transition-all py-6 text-center hover:border-gray-200">
                <div className="text-4xl mb-3">📋</div>
                <div className="font-black text-brand-black">כל המשרות</div>
                <div className="text-sm text-brand-gray font-medium mt-1">
                  {stats.activeJobs} פעילות
                </div>
              </div>
            </Link>
          </div>
        </>
      )}
    </AppShell>
  );
}
