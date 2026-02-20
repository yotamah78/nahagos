import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Illustrations ────────────────────────────────────────────────────────────

function CarServiceIllustration() {
  return (
    <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
      {/* Background blobs */}
      <circle cx="140" cy="105" r="92" fill="#f0fdf4"/>
      <circle cx="64"  cy="68"  r="28" fill="#dcfce7" opacity="0.6"/>
      <circle cx="218" cy="140" r="20" fill="#dcfce7" opacity="0.5"/>

      {/* Road */}
      <rect x="20" y="122" width="240" height="18" rx="9" fill="#dcfce7"/>
      <rect x="58"  y="128" width="24" height="6" rx="3" fill="white" opacity="0.7"/>
      <rect x="100" y="128" width="24" height="6" rx="3" fill="white" opacity="0.7"/>
      <rect x="142" y="128" width="24" height="6" rx="3" fill="white" opacity="0.7"/>
      <rect x="184" y="128" width="24" height="6" rx="3" fill="white" opacity="0.7"/>

      {/* Car body */}
      <rect x="108" y="100" width="66" height="26" rx="9" fill="#16a34a"/>
      <path d="M121 100 L133 80 L158 80 L170 100 Z" fill="#15803d"/>
      <rect x="130" y="82" width="30" height="15" rx="3" fill="#bbf7d0" opacity="0.9"/>
      {/* Car windows divider */}
      <line x1="145" y1="82" x2="145" y2="97" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
      {/* Wheels */}
      <circle cx="121" cy="128" r="10" fill="#111827"/>
      <circle cx="121" cy="128" r="5"  fill="#4b5563"/>
      <circle cx="121" cy="128" r="2"  fill="#9ca3af"/>
      <circle cx="162" cy="128" r="10" fill="#111827"/>
      <circle cx="162" cy="128" r="5"  fill="#4b5563"/>
      <circle cx="162" cy="128" r="2"  fill="#9ca3af"/>
      {/* Headlight */}
      <ellipse cx="175" cy="108" rx="4" ry="3" fill="#fef9c3" opacity="0.9"/>

      {/* Arrow (direction: right to left in RTL context) */}
      <path d="M100 110 L86 110" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M93 104 L86 110 L93 116" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Service station (left = destination) */}
      <rect x="14" y="72" width="58" height="56" rx="8" fill="white" stroke="#16a34a" strokeWidth="2"/>
      {/* Roof stripe */}
      <rect x="14" y="72" width="58" height="10" rx="8" fill="#16a34a"/>
      <rect x="14" y="78" width="58" height="4" fill="#16a34a"/>
      {/* Wrench icon */}
      <path d="M36 107 C36 100 43 97 47 100 L43 104 L46 107 L50 103 C53 107 50 114 45 114 C40 114 36 111 36 107 Z"
        fill="#16a34a" opacity="0.8"/>
      <line x1="46" y1="107" x2="55" y2="118" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Water drops */}
      <ellipse cx="57" cy="88" rx="3" ry="4.5" fill="#93c5fd" opacity="0.75"/>
      <ellipse cx="50" cy="84" rx="2.5" ry="3.5" fill="#7dd3fc" opacity="0.6"/>
      <ellipse cx="63" cy="94" rx="2" ry="3" fill="#bae6fd" opacity="0.65"/>

      {/* House (right = origin) */}
      <rect x="210" y="84" width="54" height="40" rx="4" fill="white" stroke="#16a34a" strokeWidth="2"/>
      <path d="M204 87 L237 60 L270 87" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="225" y="102" width="20" height="22" rx="3" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5"/>
      <circle cx="222" cy="114" r="2" fill="#16a34a" opacity="0.5"/>

      {/* Sparkle */}
      <path d="M192 58 L194 51 L196 58 L203 60 L196 62 L194 69 L192 62 L185 60 Z" fill="#fbbf24" opacity="0.8"/>
    </svg>
  );
}

function VerifiedDriverIllustration() {
  return (
    <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
      {/* Background */}
      <circle cx="140" cy="105" r="92" fill="#eff6ff"/>
      <circle cx="60"  cy="148" r="24" fill="#dbeafe" opacity="0.5"/>
      <circle cx="220" cy="62"  r="18" fill="#dbeafe" opacity="0.4"/>

      {/* Shield */}
      <path d="M140 34 L186 52 L186 104 C186 136 140 158 140 158 C140 158 94 136 94 104 L94 52 Z"
        fill="#dcfce7" stroke="#16a34a" strokeWidth="3.5" strokeLinejoin="round"/>
      {/* Shield inner */}
      <path d="M140 48 L174 63 L174 102 C174 126 140 144 140 144 C140 144 106 126 106 102 L106 63 Z"
        fill="white" opacity="0.5"/>

      {/* Person silhouette inside shield */}
      <circle cx="140" cy="82" r="14" fill="#16a34a" opacity="0.15"/>
      <circle cx="140" cy="79" r="8" fill="#16a34a" opacity="0.35"/>
      <path d="M124 104 C124 96 132 92 140 92 C148 92 156 96 156 104" fill="#16a34a" opacity="0.2"/>

      {/* Checkmark */}
      <path d="M120 103 L134 117 L162 88" stroke="#16a34a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Verified badge */}
      <circle cx="180" cy="46" r="16" fill="#16a34a"/>
      <path d="M174 46 L178 50 L186 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* 5 Stars */}
      {[0,1,2,3,4].map(i => (
        <g key={i} transform={`translate(${96 + i * 20}, 168)`}>
          <path d="M0 -8 L2.4 -2.5 L8.5 -2.5 L3.6 1.2 L5.5 7.5 L0 4 L-5.5 7.5 L-3.6 1.2 L-8.5 -2.5 L-2.4 -2.5 Z"
            fill={i < 5 ? "#fbbf24" : "#e5e7eb"}/>
        </g>
      ))}

      {/* Review bubbles */}
      <rect x="40" y="86" width="42" height="28" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <path d="M60 114 L55 120 L68 114" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <rect x="48" y="94" width="26" height="4" rx="2" fill="#dcfce7"/>
      <rect x="48" y="102" width="18" height="4" rx="2" fill="#f3f4f6"/>

      <rect x="198" y="100" width="42" height="28" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <path d="M220 100 L215 94 L228 100" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <rect x="206" y="108" width="26" height="4" rx="2" fill="#dcfce7"/>
      <rect x="206" y="116" width="18" height="4" rx="2" fill="#f3f4f6"/>
    </svg>
  );
}

function DriverEarningsIllustration() {
  return (
    <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-sm">
      {/* Background */}
      <circle cx="140" cy="105" r="92" fill="#fffbeb"/>
      <circle cx="62"  cy="62"  r="24" fill="#fef3c7" opacity="0.6"/>
      <circle cx="218" cy="150" r="22" fill="#fef3c7" opacity="0.5"/>

      {/* Steering wheel outer ring */}
      <circle cx="140" cy="105" r="58" fill="none" stroke="#16a34a" strokeWidth="9"/>
      {/* Inner ring */}
      <circle cx="140" cy="105" r="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="7"/>
      {/* Spokes */}
      <line x1="140" y1="85"  x2="140" y2="47"  stroke="#16a34a" strokeWidth="8" strokeLinecap="round"/>
      <line x1="124" y1="115" x2="92"  y2="140" stroke="#16a34a" strokeWidth="8" strokeLinecap="round"/>
      <line x1="156" y1="115" x2="188" y2="140" stroke="#16a34a" strokeWidth="8" strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="140" cy="105" r="7" fill="#16a34a"/>

      {/* Coin top-left */}
      <circle cx="66" cy="64" r="22" fill="#fbbf24"/>
      <circle cx="66" cy="64" r="17" fill="none" stroke="#f59e0b" strokeWidth="2"/>
      <text x="66" y="70" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="Arial">₪</text>

      {/* Coin top-right */}
      <circle cx="214" cy="58" r="18" fill="#fbbf24"/>
      <circle cx="214" cy="58" r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="214" y="64" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white" fontFamily="Arial">₪</text>

      {/* Coin bottom-right */}
      <circle cx="218" cy="152" r="20" fill="#fbbf24"/>
      <circle cx="218" cy="152" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="218" y="158" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial">₪</text>

      {/* Location pin */}
      <path d="M62 158 C62 144 78 138 78 138 C78 138 94 144 94 158 C94 172 78 186 78 186 C78 186 62 172 62 158 Z"
        fill="#16a34a"/>
      <circle cx="78" cy="158" r="8" fill="white"/>

      {/* Upward trend arrow */}
      <path d="M178 34 L198 14 L218 34" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="198" y1="14" x2="198" y2="46" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const slides = [
  {
    Illustration: CarServiceIllustration,
    title: 'הרכב שלך – בידיים מקצועיות',
    subtitle: 'מצא נהג שיקח את הרכב לשטיפה, מוסך, או כל שירות אחר – ויחזיר אותו אליך',
  },
  {
    Illustration: VerifiedDriverIllustration,
    title: 'נהגים מאומתים בלבד',
    subtitle: 'כל נהג עובר בדיקת זהות ורישיון. תראה ביקורות אמיתיות לפני שתבחר',
  },
  {
    Illustration: DriverEarningsIllustration,
    title: 'הצטרף כנהג ותרוויח',
    subtitle: 'קבל משרות באזורך, נהל את הזמן שלך בחופשיות, ותהנה מהכנסה נוספת',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WelcomePage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const goToLogin = () => navigate('/login');

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (delta > 60 && current < slides.length - 1) setCurrent(c => c + 1);
    if (delta < -60 && current > 0) setCurrent(c => c - 1);
  };

  return (
    <div
      className="h-screen flex flex-col bg-white overflow-hidden select-none"
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg width="22" height="14" viewBox="0 0 26 16" fill="none">
              <rect x="1" y="7" width="24" height="7" rx="2.5" fill="white"/>
              <path d="M5 7 L8 2 L18 2 L21 7 Z" fill="white" opacity="0.8"/>
              <circle cx="7.5" cy="14" r="3" fill="white"/>
              <circle cx="18.5" cy="14" r="3" fill="white"/>
              <circle cx="7.5"  cy="14" r="1.2" fill="#16a34a"/>
              <circle cx="18.5" cy="14" r="1.2" fill="#16a34a"/>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-brand-black">CarRelay</span>
        </div>
        {/* Skip */}
        <button
          onClick={goToLogin}
          className="text-sm font-bold text-brand-gray hover:text-brand-black transition-colors px-2 py-1"
        >
          דלג
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ width: `${slides.length * 100}%`, transform: `translateX(-${(current / slides.length) * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const Illus = slide.Illustration;
            return (
              <div
                key={i}
                className="h-full flex flex-col items-center justify-center px-8 text-center"
                style={{ width: `${100 / slides.length}%` }}
              >
                {/* Illustration */}
                <div className="w-full max-w-[280px] mx-auto mb-6">
                  <Illus />
                </div>

                {/* Text */}
                <h2 className="text-3xl font-black text-brand-black tracking-tight leading-tight mb-3">
                  {slide.title}
                </h2>
                <p className="text-base text-brand-gray font-medium leading-relaxed max-w-[260px]">
                  {slide.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-12 flex flex-col items-center gap-5 shrink-0">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2.5 bg-primary-600'
                  : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={current < slides.length - 1 ? () => setCurrent(c => c + 1) : goToLogin}
          className="btn-primary w-full max-w-xs flex items-center justify-center gap-2"
        >
          {current === slides.length - 1 ? 'כניסה למערכת' : 'המשך'}
          <span className="text-lg leading-none">←</span>
        </button>

        {/* Already have account */}
        {current === slides.length - 1 && (
          <button
            onClick={goToLogin}
            className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors"
          >
            כבר יש לי חשבון – <span className="font-bold text-primary-600">כניסה</span>
          </button>
        )}
      </div>
    </div>
  );
}
