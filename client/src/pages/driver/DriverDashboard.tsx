import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { usePolling } from '../../hooks/usePolling';
import { getAvailableJobs, getMyJobs, updateJobStatus } from '../../services/driver.service';
import type { ServiceRequest } from '../../services/requests.service';
import { formatDate, formatCurrency } from '../../utils/format';

type Tab = 'available' | 'my-jobs';

export function DriverDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('available');
  const [availableJobs, setAvailableJobs] = useState<ServiceRequest[]>([]);
  const [myJobs, setMyJobs] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isVerified = user?.driverProfile?.verificationStatus === 'VERIFIED';
  const isPending = user?.driverProfile?.verificationStatus === 'PENDING_VERIFICATION';

  const fetchData = async () => {
    try {
      const [avail, mine] = await Promise.allSettled([
        isVerified ? getAvailableJobs() : Promise.resolve([]),
        getMyJobs(),
      ]);
      if (avail.status === 'fulfilled') setAvailableJobs(avail.value);
      if (mine.status === 'fulfilled') setMyJobs(mine.value);
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchData, 30000);

  const handleUpdateStatus = async (requestId: string, status: 'IN_PROGRESS' | 'COMPLETED') => {
    setActionLoading(requestId);
    try {
      await updateJobStatus(requestId, status);
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  if (!user?.driverProfile) {
    return (
      <AppShell>
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 40 24" className="w-10 fill-primary-600">
              <rect x="2" y="10" width="36" height="10" rx="3"/>
              <path d="M8 10 L12 4 L28 4 L32 10 Z"/>
              <circle cx="10" cy="20" r="4" fill="white"/>
              <circle cx="30" cy="20" r="4" fill="white"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-brand-black mb-2">השלם את ההרשמה כנהג</h2>
          <p className="text-brand-gray font-medium mb-6 max-w-xs mx-auto">
            כדי להתחיל לקבל עבודות, עליך להשלים את פרופיל הנהג שלך.
          </p>
          <Link to="/driver/onboarding" className="btn-primary inline-flex">
            השלם הרשמה
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-black tracking-tight">
          שלום, {user?.name?.split(' ')[0]}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge status={user?.driverProfile?.verificationStatus ?? 'PENDING_VERIFICATION'} />
          {isPending && (
            <span className="text-xs text-brand-gray font-medium">ממתין לאישור מנהל מערכת</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
        <button
          onClick={() => setTab('available')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'available'
              ? 'bg-white text-brand-black shadow-sm'
              : 'text-brand-gray hover:text-brand-black'
          }`}
        >
          משרות זמינות
          {availableJobs.length > 0 && (
            <span className={`mr-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              tab === 'available' ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-brand-gray'
            }`}>
              {availableJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('my-jobs')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'my-jobs'
              ? 'bg-white text-brand-black shadow-sm'
              : 'text-brand-gray hover:text-brand-black'
          }`}
        >
          המשרות שלי
          {myJobs.length > 0 && (
            <span className={`mr-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              tab === 'my-jobs' ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-brand-gray'
            }`}>
              {myJobs.length}
            </span>
          )}
        </button>
      </div>

      {loading && <div className="flex justify-center py-12"><Spinner /></div>}

      {/* Available Jobs */}
      {!loading && tab === 'available' && (
        <>
          {!isVerified && (
            <div className="card border-amber-200 bg-amber-50 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">⏳</span>
                <div>
                  <p className="font-bold text-amber-800">
                    {isPending ? 'פרופיל ממתין לאישור' : 'פרופיל לא אושר'}
                  </p>
                  <p className="text-sm text-amber-700 font-medium mt-0.5">
                    {isPending
                      ? 'לאחר אישור, תוכל לראות ולהגיש הצעות על משרות.'
                      : 'צור קשר עם התמיכה לפרטים.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerified && availableJobs.length === 0 && (
            <div className="card text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-bold text-brand-black">אין משרות זמינות כרגע</p>
              <p className="text-sm text-brand-gray font-medium mt-1">
                הדף מתרענן אוטומטית כל 30 שניות
              </p>
            </div>
          )}

          <div className="space-y-3">
            {availableJobs.map(job => (
              <Link key={job.id} to={`/driver/job/${job.id}`}>
                <div className="card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={job.status} />
                        {job._count && (
                          <span className="text-xs font-semibold text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                            {job._count.bids} הצעות
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-brand-black truncate">
                        {job.carModel} &bull; {job.carPlateNumber}
                      </p>
                      <p className="text-sm text-brand-gray truncate mt-0.5 font-medium">
                        📍 {job.destinationAddress}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">
                        🕐 {formatDate(job.pickupDatetime)}
                      </p>
                    </div>
                    <div className="text-gray-300 text-xl font-bold mt-1">›</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* My Jobs */}
      {!loading && tab === 'my-jobs' && (
        <>
          {myJobs.length === 0 && (
            <div className="card text-center py-16">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-bold text-brand-black">אין משרות פעילות</p>
              <p className="text-sm text-brand-gray font-medium mt-1">
                עבור ל"משרות זמינות" והגש הצעות
              </p>
            </div>
          )}

          <div className="space-y-3">
            {myJobs.map(job => (
              <div key={job.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <StatusBadge status={job.status} />
                    <p className="font-bold text-brand-black mt-2 truncate">
                      {job.carModel} &bull; {job.carPlateNumber}
                    </p>
                    <p className="text-sm text-brand-gray font-medium truncate mt-0.5">
                      📍 {job.destinationAddress}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      👤 {(job.customer as { name?: string })?.name}
                    </p>
                  </div>
                  {(job.payment as { driverAmount?: number })?.driverAmount && (
                    <div className="text-xl font-black text-primary-600 shrink-0">
                      {formatCurrency(Number((job.payment as { driverAmount?: number })?.driverAmount))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {job.status === 'DRIVER_SELECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(job.id, 'IN_PROGRESS')}
                      disabled={actionLoading === job.id}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {actionLoading === job.id ? <Spinner size="sm" /> : '🚗 התחל משרה'}
                    </button>
                  )}
                  {job.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                      disabled={actionLoading === job.id}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {actionLoading === job.id ? <Spinner size="sm" /> : '✅ סיים משרה'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link to="/driver/earnings" className="card text-center hover:border-primary-200 transition-colors cursor-pointer py-5">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm font-bold text-brand-black">הכנסות</div>
        </Link>
        <Link to="/driver/profile" className="card text-center hover:border-primary-200 transition-colors cursor-pointer py-5">
          <div className="text-3xl mb-2">👤</div>
          <div className="text-sm font-bold text-brand-black">הפרופיל שלי</div>
        </Link>
      </div>
    </AppShell>
  );
}
