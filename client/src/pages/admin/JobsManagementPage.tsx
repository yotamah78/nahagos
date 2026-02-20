import { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { getAllRequests } from '../../services/admin.service';
import { formatDateShort, formatCurrency } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: '', label: 'הכל' },
  { value: 'OPEN', label: 'פתוח' },
  { value: 'BIDDING', label: 'הצעות' },
  { value: 'DRIVER_SELECTED', label: 'נהג נבחר' },
  { value: 'IN_PROGRESS', label: 'בדרך' },
  { value: 'COMPLETED', label: 'הושלם' },
  { value: 'CANCELLED', label: 'בוטל' },
];

export function JobsManagementPage() {
  const [requests, setRequests] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllRequests(filter || undefined).then(setRequests).finally(() => setLoading(false));
  }, [filter]);

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-brand-black tracking-tight mb-6">כל המשרות</h1>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              filter === opt.value
                ? 'bg-brand-black text-white'
                : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {!loading && (requests as Array<{
        id: string;
        status: string;
        carModel: string;
        carPlateNumber: string;
        destinationAddress: string;
        createdAt: string;
        customer: { name: string };
        _count: { bids: number };
        payment?: { amount: number; status: string } | null;
      }>).map(req => (
        <div key={req.id} className="card mb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={req.status} />
                {req._count.bids > 0 && (
                  <span className="text-xs font-semibold text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                    {req._count.bids} הצעות
                  </span>
                )}
              </div>
              <p className="font-bold text-brand-black truncate">
                {req.carModel} &bull; {req.carPlateNumber}
              </p>
              <p className="text-sm text-brand-gray font-medium truncate mt-0.5">
                📍 {req.destinationAddress}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                👤 {req.customer.name} &bull; {formatDateShort(req.createdAt)}
              </p>
            </div>
            {req.payment && (
              <div className="text-base font-black text-primary-600 shrink-0">
                {formatCurrency(Number(req.payment.amount))}
              </div>
            )}
          </div>
        </div>
      ))}

      {!loading && requests.length === 0 && (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-bold text-brand-black">אין משרות להצגה</p>
          {filter && (
            <p className="text-sm text-brand-gray font-medium mt-1">נסה לשנות את הסינון</p>
          )}
        </div>
      )}
    </AppShell>
  );
}
