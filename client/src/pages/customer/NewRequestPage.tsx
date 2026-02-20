import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Spinner } from '../../components/ui/Spinner';
import { createRequest } from '../../services/requests.service';

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="font-black text-brand-black text-lg tracking-tight">{title}</h2>
    </div>
  );
}

export function NewRequestPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    pickupAddress: '',
    returnAddress: '',
    destinationAddress: '',
    pickupDatetime: '',
    maxReturnDatetime: '',
    notes: '',
    carModel: '',
    carPlateNumber: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const req = await createRequest({
        ...form,
        pickupDatetime: new Date(form.pickupDatetime).toISOString(),
        maxReturnDatetime: form.maxReturnDatetime ? new Date(form.maxReturnDatetime).toISOString() : undefined,
      });
      navigate(`/requests/${req.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה ביצירת הבקשה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="text-brand-gray text-sm mb-5 flex items-center gap-1 hover:text-brand-black font-semibold transition-colors">
          ‹ חזרה
        </button>

        <h1 className="text-3xl font-black text-brand-black tracking-tight mb-7">בקשת שירות חדשה</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-5 text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="card">
            <SectionHeader icon="🚗" title="פרטי הרכב" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">דגם רכב *</label>
                <input className="input-field" value={form.carModel} onChange={set('carModel')} placeholder="Toyota Corolla" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">מספר רישוי *</label>
                <input className="input-field" value={form.carPlateNumber} onChange={set('carPlateNumber')} placeholder="12-345-67" required dir="ltr" />
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader icon="📍" title="כתובות" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">כתובת איסוף הרכב *</label>
                <input className="input-field" value={form.pickupAddress} onChange={set('pickupAddress')} placeholder="רחוב, עיר" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">יעד (מוסך / שטיפה) *</label>
                <input className="input-field" value={form.destinationAddress} onChange={set('destinationAddress')} placeholder="שם העסק + כתובת" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">כתובת החזרת הרכב *</label>
                <input className="input-field" value={form.returnAddress} onChange={set('returnAddress')} placeholder="זהה לכתובת האיסוף?" required />
                <button type="button" className="text-xs text-primary-600 font-bold mt-1.5 hover:underline"
                  onClick={() => setForm(f => ({ ...f, returnAddress: f.pickupAddress }))}>
                  העתק כתובת איסוף
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader icon="🕐" title="מועדים" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">מועד איסוף *</label>
                <input type="datetime-local" className="input-field" value={form.pickupDatetime} onChange={set('pickupDatetime')} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1.5">מועד החזרה מקסימלי <span className="font-medium text-brand-gray">(אופציונלי)</span></label>
                <input type="datetime-local" className="input-field" value={form.maxReturnDatetime} onChange={set('maxReturnDatetime')} />
              </div>
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-bold text-brand-black mb-1.5">
              הערות <span className="font-medium text-brand-gray">(אופציונלי)</span>
            </label>
            <textarea className="input-field resize-none" rows={3} value={form.notes} onChange={set('notes')}
              placeholder="הוראות מיוחדות, פרטים על הרכב..." />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Spinner size="sm" /> שולח...</> : 'פרסם בקשה'}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
