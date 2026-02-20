import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/auth.service';
import { Spinner } from '../../components/ui/Spinner';

function CarWashIllustration() {
  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="184" rx="110" ry="8" fill="rgba(0,0,0,0.2)"/>
      <rect x="25" y="110" width="250" height="52" rx="12" fill="#22c55e"/>
      <path d="M70 110 L100 65 L205 65 L235 110 Z" fill="#16a34a"/>
      <path d="M108 68 L122 108 L193 108 L207 68 Z" fill="#bbf7d0" opacity="0.85"/>
      <path d="M104 70 L89 108 L122 108 Z" fill="#bbf7d0" opacity="0.5"/>
      <rect x="253" y="122" width="20" height="22" rx="5" fill="#15803d"/>
      <rect x="27" y="122" width="20" height="22" rx="5" fill="#15803d"/>
      <ellipse cx="268" cy="130" rx="8" ry="5" fill="#fef9c3" opacity="0.95"/>
      <ellipse cx="36" cy="130" rx="6" ry="4" fill="#fca5a5" opacity="0.7"/>
      <circle cx="205" cy="162" r="26" fill="#111827"/>
      <circle cx="205" cy="162" r="14" fill="#374151"/>
      <circle cx="205" cy="162" r="6" fill="#6b7280"/>
      <circle cx="95" cy="162" r="26" fill="#111827"/>
      <circle cx="95" cy="162" r="14" fill="#374151"/>
      <circle cx="95" cy="162" r="6" fill="#6b7280"/>
      <line x1="155" y1="112" x2="155" y2="158" stroke="#15803d" strokeWidth="2" opacity="0.6"/>
      <ellipse cx="270" cy="40" rx="7" ry="12" fill="#93c5fd" opacity="0.8"/>
      <ellipse cx="252" cy="22" rx="5" ry="9" fill="#7dd3fc" opacity="0.65"/>
      <ellipse cx="285" cy="60" rx="5" ry="9" fill="#93c5fd" opacity="0.7"/>
      <ellipse cx="238" cy="45" rx="4" ry="7" fill="#bae6fd" opacity="0.6"/>
      <path d="M45 55 L47 48 L49 55 L56 57 L49 59 L47 66 L45 59 L38 57 Z" fill="white" opacity="0.55"/>
      <path d="M28 88 L29.5 83 L31 88 L36 89.5 L31 91 L29.5 96 L28 91 L23 89.5 Z" fill="white" opacity="0.4"/>
      <path d="M60 30 L61 27 L62 30 L65 31 L62 32 L61 35 L60 32 L57 31 Z" fill="white" opacity="0.5"/>
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, accessToken, refreshToken } = await login(form.email, form.password);
      setTokens(accessToken, refreshToken, user);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'DRIVER') navigate('/driver/dashboard');
      else navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg || 'שגיאה בכניסה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Hero Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary-800 opacity-50"/>
        <div className="absolute bottom-16 left-8 w-56 h-56 rounded-full bg-primary-800 opacity-40"/>
        <div className="relative z-10 text-center">
          <CarWashIllustration />
          <h2 className="text-4xl font-black text-white mt-8 leading-tight tracking-tight">
            הרכב שלך.<br/>בידיים טובות.
          </h2>
          <p className="text-primary-200 mt-4 text-lg font-medium">שירות מסירת רכב חכם ומהיר</p>
          <div className="flex items-center justify-center gap-8 mt-8">
            {[{ icon: '🔧', text: 'מוסך' }, { icon: '🚿', text: 'שטיפה' }, { icon: '🔑', text: 'מסירה' }].map(item => (
              <div key={item.text} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-primary-300 text-xs font-bold tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
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

          <div className="mb-8">
            <h1 className="text-3xl font-black text-brand-black">כניסה למערכת</h1>
            <p className="text-brand-gray mt-1.5 font-medium">ברוך הבא בחזרה</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">אימייל</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-black mb-1.5">סיסמה</label>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="הזן סיסמה"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><Spinner size="sm" /> טוען...</> : 'כניסה'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-gray mt-6">
            אין לך חשבון?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">הירשם כאן</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
