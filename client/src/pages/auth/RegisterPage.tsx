import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register, sendOtp, verifyOtp } from '../../services/auth.service';
import { Spinner } from '../../components/ui/Spinner';

type Step = 'form' | 'otp';

const ROLES = [
  { value: 'CUSTOMER', label: 'לקוח', desc: 'אני צריך שירות לרכב', icon: '🧑' },
  { value: 'DRIVER',   label: 'נהג',   desc: 'אני רוצה להסיע רכבים', icon: '🔑' },
] as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'DRIVER',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingTokens, setPendingTokens] = useState<{ accessToken: string; refreshToken: string; user: typeof form & { id: string; phoneVerified: boolean; emailVerified: boolean } } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(form);
      setPendingTokens(result as never);
      await sendOtp(form.phone);
      setStep('otp');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(form.phone, otp);
      if (pendingTokens) {
        setTokens(pendingTokens.accessToken, pendingTokens.refreshToken, pendingTokens.user as never);
      }
      navigate(form.role === 'DRIVER' ? '/driver/onboarding' : '/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'קוד לא תקין');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Hero Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary-800 opacity-50"/>
        <div className="absolute bottom-16 left-8 w-56 h-56 rounded-full bg-primary-800 opacity-40"/>
        <div className="relative z-10 text-center text-white">
          <div className="text-6xl mb-6">🚗</div>
          <h2 className="text-3xl font-black leading-tight tracking-tight">
            הצטרף ל-CarRelay
          </h2>
          <p className="text-primary-200 mt-4 font-medium leading-relaxed">
            פלטפורמה חכמה לחיבור<br/>בין בעלי רכב לנהגים מקצועיים
          </p>
          <div className="mt-8 space-y-3">
            {['✓ נהגים מאומתים בלבד', '✓ תשלום מאובטח', '✓ מעקב בזמן אמת'].map(f => (
              <div key={f} className="flex items-center gap-2 text-primary-200 text-sm font-medium">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <svg width="28" height="18" viewBox="0 0 26 16" fill="none">
              <rect x="1" y="7" width="24" height="7" rx="2.5" fill="#16a34a"/>
              <path d="M5 7 L8 2 L18 2 L21 7 Z" fill="#16a34a" opacity="0.75"/>
              <circle cx="7.5" cy="14" r="3" fill="#16a34a"/>
              <circle cx="18.5" cy="14" r="3" fill="#16a34a"/>
              <circle cx="7.5" cy="14" r="1.2" fill="white"/>
              <circle cx="18.5" cy="14" r="1.2" fill="white"/>
            </svg>
            <span className="text-2xl font-black tracking-tight text-brand-black">CarRelay</span>
          </div>

          {step === 'form' ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-black text-brand-black">יצירת חשבון</h1>
                <p className="text-brand-gray mt-1.5 font-medium">הצטרף לאלפי משתמשים מרוצים</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-4 text-sm font-medium">{error}</div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">שם מלא</label>
                  <input type="text" className="input-field" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="ישראל ישראלי" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">אימייל</label>
                  <input type="email" className="input-field" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" dir="ltr" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">טלפון</label>
                  <input type="tel" className="input-field" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="05XXXXXXXX" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-1.5">סיסמה</label>
                  <input type="password" className="input-field" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="לפחות 8 תווים" required minLength={8} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-black mb-2">אני מצטרף כ:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(r => (
                      <button key={r.value} type="button"
                        onClick={() => setForm(f => ({ ...f, role: r.value }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          form.role === r.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{r.icon}</div>
                        <div className={`text-sm font-bold ${form.role === r.value ? 'text-primary-700' : 'text-brand-black'}`}>
                          {r.label}
                        </div>
                        <div className="text-xs text-brand-gray mt-0.5">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                  {loading ? <><Spinner size="sm" /> שולח...</> : 'הרשמה'}
                </button>
              </form>

              <p className="text-center text-sm text-brand-gray mt-5">
                יש לך חשבון?{' '}
                <Link to="/login" className="text-primary-600 font-bold hover:underline">כניסה</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl mb-4">📱</div>
                <h1 className="text-3xl font-black text-brand-black">אימות טלפון</h1>
                <p className="text-brand-gray mt-2 font-medium">
                  שלחנו קוד ל-{form.phone}
                </p>
                {import.meta.env.DEV && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">
                    מצב פיתוח: קוד הוא <strong>123456</strong>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-4 text-sm font-medium">{error}</div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  className="input-field text-center text-3xl tracking-[0.5em] font-black"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------"
                  maxLength={6}
                  required
                  dir="ltr"
                />
                <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <><Spinner size="sm" /> מאמת...</> : 'אמת וכנס'}
                </button>
                <button type="button" className="w-full text-sm font-semibold text-brand-gray hover:text-primary-600 transition-colors"
                  onClick={() => sendOtp(form.phone)}>
                  שלח קוד שוב
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
