import { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Spinner } from '../../components/ui/Spinner';
import { getEarnings } from '../../services/driver.service';
import { formatCurrency, formatDateShort } from '../../utils/format';

export function EarningsPage() {
  const [data, setData] = useState<{ total: number; payments: unknown[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEarnings().then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-brand-black tracking-tight mb-6">הכנסות</h1>

      {loading && <div className="flex justify-center py-16"><Spinner /></div>}

      {data && (
        <>
          {/* Total earnings card */}
          <div className="card border-2 border-primary-200 bg-primary-50 mb-6 text-center py-8">
            <p className="text-sm font-bold text-primary-600 mb-2">סה&quot;כ הכנסות</p>
            <p className="stat-value text-primary-700">{formatCurrency(data.total)}</p>
            <p className="text-xs text-primary-500 font-medium mt-1">לאחר עמלת פלטפורמה</p>
          </div>

          {data.payments.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-4xl mb-3">💰</div>
              <p className="font-bold text-brand-black">אין הכנסות עדיין</p>
              <p className="text-sm text-brand-gray font-medium mt-1">
                השלם משרות כדי לראות הכנסות כאן
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-lg font-black text-brand-black mb-2">היסטוריית תשלומים</h2>
              {(data.payments as Array<{
                id: string;
                driverAmount: number;
                createdAt: string;
                request: { carModel: string; destinationAddress: string; customer: { name: string } };
              }>).map(payment => (
                <div key={payment.id} className="card">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-black truncate">{payment.request.carModel}</p>
                      <p className="text-sm text-brand-gray font-medium truncate mt-0.5">
                        📍 {payment.request.destinationAddress}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        👤 {payment.request.customer.name} &bull; {formatDateShort(payment.createdAt)}
                      </p>
                    </div>
                    <p className="text-lg font-black text-primary-600 shrink-0">
                      +{formatCurrency(Number(payment.driverAmount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
