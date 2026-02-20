export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  return (
    <div className={`animate-spin rounded-full border-primary-100 border-t-primary-600 ${sizes[size]}`} />
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-medium text-brand-gray">טוען...</p>
      </div>
    </div>
  );
}
