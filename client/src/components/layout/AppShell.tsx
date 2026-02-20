import { Navbar } from './Navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-light" dir="rtl">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-7">
        {children}
      </main>
    </div>
  );
}
