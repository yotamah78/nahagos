import { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { getPendingDrivers, verifyDriver } from '../../services/admin.service';

interface PendingDriver {
  id: string;
  verificationStatus: string;
  licenseImageUrl?: string;
  selfieImageUrl?: string;
  photoUrl?: string;
  city: string;
  user: { id: string; name: string; email: string; phone: string; createdAt: string };
}

export function DriverApprovalPage() {
  const [drivers, setDrivers] = useState<PendingDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PendingDriver | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDrivers = async () => {
    const data = await getPendingDrivers();
    setDrivers(data);
    setLoading(false);
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleVerify = async (approve: boolean) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await verifyDriver(selected.user.id, approve, approve ? undefined : rejectionReason);
      setSelected(null);
      setRejectionReason('');
      await fetchDrivers();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-brand-black tracking-tight mb-6">אישור נהגים</h1>

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {!loading && drivers.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ✅
          </div>
          <p className="font-black text-brand-black">אין נהגים ממתינים לאישור</p>
          <p className="text-sm text-brand-gray font-medium mt-1">כל הבקשות טופלו</p>
        </div>
      )}

      <div className="space-y-3">
        {drivers.map(driver => (
          <div
            key={driver.id}
            className="card-hover cursor-pointer"
            onClick={() => setSelected(driver)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg shrink-0">
                  {driver.user.name[0]}
                </div>
                <div>
                  <p className="font-bold text-brand-black">{driver.user.name}</p>
                  <p className="text-sm text-brand-gray font-medium">
                    {driver.user.email} &bull; {driver.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={driver.verificationStatus} />
                <span className="text-gray-300 text-xl font-bold">›</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-brand-black">{selected.user.name}</h2>
                <p className="text-sm text-brand-gray font-medium mt-0.5">{selected.city}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-brand-gray hover:bg-gray-200 transition-colors font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Driver details */}
              <div className="space-y-2">
                {[
                  { label: 'אימייל', value: selected.user.email },
                  { label: 'טלפון', value: selected.user.phone },
                  { label: 'עיר', value: selected.city },
                ].map(row => (
                  <div key={row.label} className="flex gap-2 text-sm">
                    <span className="font-bold text-brand-black w-16 shrink-0">{row.label}:</span>
                    <span className="text-brand-gray font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Images */}
              <div>
                <p className="text-sm font-bold text-brand-black mb-2">מסמכים ותמונות</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { url: selected.photoUrl, label: 'פרופיל' },
                    { url: selected.licenseImageUrl, label: 'רישיון' },
                    { url: selected.selfieImageUrl, label: 'סלפי' },
                  ].map(img => (
                    <div key={img.label} className="text-center">
                      <div className="h-24 bg-gray-100 rounded-2xl overflow-hidden mb-1.5">
                        {img.url ? (
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-brand-gray text-xs font-medium">
                            לא הועלה
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-brand-gray font-medium">{img.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection reason */}
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">
                  סיבת דחייה <span className="font-medium text-brand-gray">(אם רלוונטי)</span>
                </label>
                <input
                  className="input-field"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="תעודה לא ברורה, מידע חסר..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleVerify(false)}
                  disabled={actionLoading}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Spinner size="sm" /> : '✕ דחה'}
                </button>
                <button
                  onClick={() => handleVerify(true)}
                  disabled={actionLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Spinner size="sm" /> : '✓ אשר נהג'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
