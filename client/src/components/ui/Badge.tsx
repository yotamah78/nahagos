type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange';

const variants: Record<BadgeVariant, string> = {
  green:  'bg-primary-50 text-primary-700 border border-primary-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  red:    'bg-red-50 text-red-700 border border-red-200',
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
};

export function Badge({ children, variant = 'gray' }: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  OPEN:               { label: 'פתוח',          variant: 'blue' },
  BIDDING:            { label: 'הצעות מחיר',    variant: 'yellow' },
  DRIVER_SELECTED:    { label: 'נהג נבחר',      variant: 'blue' },
  IN_PROGRESS:        { label: 'בדרך',           variant: 'orange' },
  COMPLETED:          { label: 'הושלם',          variant: 'green' },
  CANCELLED:          { label: 'בוטל',           variant: 'red' },
  PENDING_VERIFICATION: { label: 'ממתין לאישור', variant: 'yellow' },
  VERIFIED:           { label: 'מאושר ✓',        variant: 'green' },
  REJECTED:           { label: 'נדחה',           variant: 'red' },
};

export function StatusBadge({ status }: { status: string }) {
  const { label, variant } = statusMap[status] ?? { label: status, variant: 'gray' };
  return <Badge variant={variant}>{label}</Badge>;
}
