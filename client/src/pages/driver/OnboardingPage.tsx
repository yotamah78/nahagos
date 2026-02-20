import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { Spinner } from '../../components/ui/Spinner';
import { upsertProfile } from '../../services/driver.service';

type Step = 1 | 2 | 3;

export function OnboardingPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    city: '',
    bio: '',
    photoUrl: '',
    licenseImageUrl: '',
    selfieImageUrl: '',
    payoutType: 'bank',
    bankDetails: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const mockUpload = (fieldName: string) => {
    const url = `https://picsum.photos/seed/${Date.now()}/400/300`;
    setForm(f => ({ ...f, [fieldName]: url }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await upsertProfile({
        city: form.city,
        bio: form.bio,
        photoUrl: form.photoUrl || undefined,
        licenseImageUrl: form.licenseImageUrl || undefined,
        selfieImageUrl: form.selfieImageUrl || undefined,
        payoutMethod: { type: form.payoutType, details: { bank: form.bankDetails } },
      });
      await refreshUser();
      navigate('/driver/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בשמירת הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['פרטים אישיים', 'מסמכים', 'תשלום'];

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-black tracking-tight mb-2">הרשמת נהג</h1>
          <p className="text-brand-gray font-medium">3 שלבים פשוטים להתחלת עבודה</p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                  s < step
                    ? 'bg-primary-600 text-white'
                    : s === step
                    ? 'bg-brand-black text-white'
                    : 'bg-gray-100 text-brand-gray'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 transition-all ${s < step ? 'bg-primary-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-brand-gray mt-3">{stepLabels[step - 1]}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="card space-y-5">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                עיר <span className="text-red-500">*</span>
              </label>
              <input
                className="input-field"
                value={form.city}
                onChange={set('city')}
                placeholder="תל אביב"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                תיאור קצר <span className="font-medium text-brand-gray">(אופציונלי)</span>
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={form.bio}
                onChange={set('bio')}
                placeholder="ספר קצת על עצמך ועל ניסיונך בנהיגה..."
              />
            </div>
            <button
              disabled={!form.city}
              onClick={() => setStep(2)}
              className="btn-primary w-full"
            >
              הבא ›
            </button>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="card space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-700 font-medium">
                📋 כל התמונות נבדקות ידנית על ידי צוות CarRelay לפני אישור.
              </p>
            </div>

            {[
              { key: 'photoUrl', label: 'תמונת פרופיל', icon: '🧑', required: false },
              { key: 'licenseImageUrl', label: 'רישיון נהיגה (חזית)', icon: '📄', required: true },
              { key: 'selfieImageUrl', label: 'סלפי עם הרישיון', icon: '🤳', required: false },
            ].map(({ key, label, icon, required }) => (
              <div key={key}>
                <label className="block text-sm font-bold text-brand-black mb-1.5">
                  {icon} {label}
                  {required && <span className="text-red-500 mr-1">*</span>}
                </label>
                {form[key as keyof typeof form] ? (
                  <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl p-3">
                    <span className="text-primary-600 font-bold text-sm">✓ הועלה בהצלחה</span>
                    <button
                      onClick={() => setForm(f => ({ ...f, [key]: '' }))}
                      className="text-xs text-red-500 font-semibold hover:text-red-700 mr-auto"
                    >
                      הסר
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => mockUpload(key)}
                    className="btn-secondary w-full text-sm"
                  >
                    העלה תמונה (demo)
                  </button>
                )}
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">‹ חזרה</button>
              <button
                disabled={!form.licenseImageUrl}
                onClick={() => setStep(3)}
                className="btn-primary flex-1"
              >
                הבא ›
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payout */}
        {step === 3 && (
          <div className="card space-y-5">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">סוג חשבון</label>
              <select className="input-field" value={form.payoutType} onChange={set('payoutType')}>
                <option value="bank">העברה בנקאית</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">
                {form.payoutType === 'bank' ? 'מספר חשבון בנק' : 'כתובת PayPal'}
              </label>
              <input
                className="input-field"
                value={form.bankDetails}
                onChange={set('bankDetails')}
                placeholder={form.payoutType === 'bank' ? 'IBAN / מספר חשבון' : 'email@paypal.com'}
                dir="ltr"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-brand-gray font-medium text-center">
                לאחר השליחה, הפרופיל יועבר לאישור מנהל מערכת. תוכל לעקוב אחר הסטטוס בדשבורד.
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">‹ חזרה</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? <><Spinner size="sm" /> שולח...</> : 'שלח לאישור ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
