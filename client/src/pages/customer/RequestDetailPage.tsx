import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';
import { usePolling } from '../../hooks/usePolling';
import { getRequestById, selectDriver, cancelRequest } from '../../services/requests.service';
import { submitReview } from '../../services/review.service';
import type { ServiceRequest } from '../../services/requests.service';
import { formatDate, formatCurrency } from '../../utils/format';

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchRequest = async () => {
    try {
      const data = await getRequestById(id!);
      setRequest(data);
      if (data.review) setReviewSubmitted(true);
    } catch {
      setError('שגיאה בטעינת הבקשה');
    } finally {
      setLoading(false);
    }
  };

  usePolling(fetchRequest, 15000);

  const handleSelectDriver = async (bidId: string) => {
    setActionLoading(true);
    try {
      await selectDriver(id!, bidId);
      await fetchRequest();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בבחירת הנהג');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('האם לבטל את הבקשה?')) return;
    setActionLoading(true);
    try {
      await cancelRequest(id!);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בביטול');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await submitReview({ requestId: id!, rating: review.rating, reviewText: review.text });
      setReviewSubmitted(true);
      await fetchRequest();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בשליחת הביקורת');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <AppShell><div className="flex justify-center py-16"><Spinner /></div></AppShell>;
  if (!request) return <AppShell><div className="card text-center py-10 text-brand-gray font-medium">בקשה לא נמצאה</div></AppShell>;

  return (
    <AppShell>
      <button onClick={() => navigate('/dashboard')} className="text-brand-gray text-sm mb-5 flex items-center gap-1 hover:text-brand-black font-semibold transition-colors">
        ‹ חזרה לדשבורד
      </button>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-sm font-medium">{error}</div>}

      {/* Request Info Card */}
      <div className="card mb-4">
        <div className="flex items-start justify-between mb-4">
          <StatusBadge status={request.status} />
          {['OPEN', 'BIDDING'].includes(request.status) && (
            <button onClick={handleCancel} disabled={actionLoading} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
              ביטול בקשה
            </button>
          )}
        </div>

        <h2 className="text-xl font-black text-brand-black mb-3">{request.carModel} &bull; {request.carPlateNumber}</h2>

        <div className="space-y-2">
          {[
            { label: 'כתובת איסוף', value: request.pickupAddress, icon: '📍' },
            { label: 'יעד', value: request.destinationAddress, icon: '🏁' },
            { label: 'כתובת החזרה', value: request.returnAddress, icon: '🔄' },
            { label: 'מועד איסוף', value: formatDate(request.pickupDatetime), icon: '🕐' },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-2 text-sm">
              <span className="shrink-0">{row.icon}</span>
              <div>
                <span className="text-brand-gray font-medium">{row.label}: </span>
                <span className="font-bold text-brand-black">{row.value}</span>
              </div>
            </div>
          ))}
          {request.notes && (
            <div className="flex items-start gap-2 text-sm">
              <span>📝</span>
              <div>
                <span className="text-brand-gray font-medium">הערות: </span>
                <span className="font-medium text-brand-dark">{request.notes}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bids Section */}
      {['OPEN', 'BIDDING'].includes(request.status) && request.bids && (
        <div>
          <h2 className="text-xl font-black text-brand-black tracking-tight mb-4">
            הצעות מחיר
            {request.bids.length > 0 && (
              <span className="text-sm font-semibold text-brand-gray mr-2">({request.bids.length})</span>
            )}
          </h2>

          {request.bids.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-3xl mb-3">⏳</div>
              <p className="font-bold text-brand-black">ממתין להצעות מחיר</p>
              <p className="text-sm text-brand-gray mt-1 font-medium">הדף מתעדכן אוטומטית</p>
            </div>
          ) : (
            <div className="space-y-3">
              {request.bids.map(bid => (
                <div key={bid.id} className="card border-2 border-gray-100 hover:border-primary-200 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-black text-lg shrink-0">
                        {bid.driver?.name?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-brand-black">{bid.driver?.name}</span>
                          {bid.driver?.driverProfile?.verificationStatus === 'VERIFIED' && (
                            <span className="badge-verified">מאומת ✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StarRating rating={bid.driver?.driverProfile?.ratingAvg ?? 0} size="sm" />
                          <span className="text-xs text-brand-gray font-medium">({bid.driver?.driverProfile?.totalJobs ?? 0} משרות)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-primary-600 shrink-0">
                      {formatCurrency(Number(bid.price))}
                    </div>
                  </div>

                  <div className="text-sm text-brand-gray font-medium space-y-1">
                    <div>🕐 החזרה משוערת: <span className="text-brand-dark font-bold">{formatDate(bid.estimatedReturnTime)}</span></div>
                    {bid.message && <div className="italic text-brand-dark">"{bid.message}"</div>}
                  </div>

                  {request.status === 'BIDDING' && (
                    <button onClick={() => handleSelectDriver(bid.id)} disabled={actionLoading}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                      {actionLoading ? <Spinner size="sm" /> : 'בחר נהג זה'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Driver */}
      {['DRIVER_SELECTED', 'IN_PROGRESS', 'COMPLETED'].includes(request.status) && request.selectedDriverId && (
        <div className="card border-2 border-primary-200 bg-primary-50 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-black text-primary-900">נהג נבחר</h3>
              <p className="text-sm text-primary-700 font-medium mt-0.5">הנהג הודע ויצור איתך קשר בהתאם.</p>
            </div>
          </div>
        </div>
      )}

      {/* Review Section */}
      {request.status === 'COMPLETED' && !reviewSubmitted && !request.review && (
        <div className="card">
          <h2 className="text-xl font-black text-brand-black tracking-tight mb-4">דרג את הנהג</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2">דירוג</label>
              <StarRating rating={review.rating} interactive onChange={r => setReview(v => ({ ...v, rating: r }))} />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                חוות דעת <span className="font-medium text-brand-gray">(אופציונלי)</span>
              </label>
              <textarea className="input-field resize-none" rows={3}
                value={review.text} onChange={e => setReview(v => ({ ...v, text: e.target.value }))}
                placeholder="תאר את חוויית השירות..." />
            </div>
            <button type="submit" disabled={actionLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {actionLoading ? <Spinner size="sm" /> : 'שלח ביקורת'}
            </button>
          </form>
        </div>
      )}

      {(reviewSubmitted || request.review) && (
        <div className="card border-2 border-primary-200 bg-primary-50">
          <p className="font-black text-primary-900">✓ תודה על הביקורת!</p>
          {request.review && <StarRating rating={request.review.rating} size="sm" />}
        </div>
      )}
    </AppShell>
  );
}
