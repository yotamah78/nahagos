import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { usePolling } from '../../hooks/usePolling';
import { getRequestById } from '../../services/requests.service';
import { submitBid, withdrawBid } from '../../services/bids.service';
import type { ServiceRequest, Bid } from '../../services/requests.service';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [bidForm, setBidForm] = useState({ price: '', estimatedReturnTime: '', message: '' });
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const fetchJob = async () => {
    try {
      const data = await getRequestById(id!);
      setJob(data);
      const myBid = data.bids?.find((b: Bid) => b.driverId === user?.id);
      if (myBid) setBidSubmitted(true);
    } catch {
      setError('שגיאה בטעינת המשרה');
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchJob, 15000);

  const myBid = job?.bids?.find((b: Bid) => b.driverId === user?.id);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await submitBid({
        requestId: id!,
        price: Number(bidForm.price),
        estimatedReturnTime: new Date(bidForm.estimatedReturnTime).toISOString(),
        message: bidForm.message || undefined,
      });
      setBidSubmitted(true);
      await fetchJob();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בהגשת ההצעה');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!myBid) return;
    setActionLoading(true);
    try {
      await withdrawBid(myBid.id);
      setBidSubmitted(false);
      await fetchJob();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <AppShell><div className="flex justify-center py-16"><Spinner /></div></AppShell>;
  if (!job) return <AppShell><div className="card text-center py-10 text-brand-gray font-medium">משרה לא נמצאה</div></AppShell>;

  return (
    <AppShell>
      <button
        onClick={() => navigate('/driver/dashboard')}
        className="text-brand-gray text-sm mb-5 flex items-center gap-1 hover:text-brand-black font-semibold transition-colors"
      >
        ‹ חזרה לדשבורד
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Job Info */}
      <div className="card mb-4">
        <div className="mb-4">
          <StatusBadge status={job.status} />
        </div>
        <h2 className="text-xl font-black text-brand-black mb-3">
          {job.carModel} &bull; {job.carPlateNumber}
        </h2>
        <div className="space-y-2">
          {[
            { label: 'כתובת איסוף', value: job.pickupAddress, icon: '📍' },
            { label: 'יעד', value: job.destinationAddress, icon: '🏁' },
            { label: 'כתובת החזרה', value: job.returnAddress, icon: '🔄' },
            { label: 'מועד איסוף', value: formatDate(job.pickupDatetime), icon: '🕐' },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-2 text-sm">
              <span className="shrink-0">{row.icon}</span>
              <div>
                <span className="text-brand-gray font-medium">{row.label}: </span>
                <span className="font-bold text-brand-black">{row.value}</span>
              </div>
            </div>
          ))}
          {job.notes && (
            <div className="flex items-start gap-2 text-sm">
              <span>📝</span>
              <div>
                <span className="text-brand-gray font-medium">הערות: </span>
                <span className="font-medium text-brand-dark">{job.notes}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid Form */}
      {!bidSubmitted && ['OPEN', 'BIDDING'].includes(job.status) && (
        <div className="card">
          <h2 className="text-xl font-black text-brand-black tracking-tight mb-4">הגש הצעת מחיר</h2>
          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                מחיר (₪) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input-field"
                value={bidForm.price}
                onChange={e => setBidForm(f => ({ ...f, price: e.target.value }))}
                placeholder="150"
                min="1"
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                זמן החזרה משוער <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={bidForm.estimatedReturnTime}
                onChange={e => setBidForm(f => ({ ...f, estimatedReturnTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                הודעה <span className="font-medium text-brand-gray">(אופציונלי)</span>
              </label>
              <textarea
                className="input-field resize-none"
                rows={2}
                value={bidForm.message}
                onChange={e => setBidForm(f => ({ ...f, message: e.target.value }))}
                placeholder="ניסיון עם סוג רכב זה, הערות נוספות..."
                maxLength={500}
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {actionLoading ? <Spinner size="sm" /> : 'שלח הצעה'}
            </button>
          </form>
        </div>
      )}

      {/* Already Bid */}
      {bidSubmitted && myBid && (
        <div className="card border-2 border-primary-200 bg-primary-50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
              ✓
            </div>
            <p className="font-black text-primary-900">הצעתך הוגשה בהצלחה</p>
          </div>
          <p className="text-sm text-primary-700 font-medium">
            מחיר שהוגש: <span className="font-black">₪{Number(myBid.price)}</span>
          </p>
          {myBid.isSelected ? (
            <div className="mt-3 bg-white border border-primary-300 rounded-xl p-3">
              <p className="text-sm font-black text-primary-700">🎉 הצעתך נבחרה! המשימה שלך.</p>
            </div>
          ) : (
            <button
              onClick={handleWithdraw}
              disabled={actionLoading}
              className="btn-danger mt-4 text-sm flex items-center gap-2"
            >
              {actionLoading ? <Spinner size="sm" /> : 'משוך הצעה'}
            </button>
          )}
        </div>
      )}
    </AppShell>
  );
}
