const heILCurrency = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const heILDate = new Intl.DateTimeFormat('he-IL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const heILDateShort = new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatCurrency(amount: number): string {
  return heILCurrency.format(amount);
}

export function formatDate(date: string | Date): string {
  return heILDate.format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return heILDateShort.format(new Date(date));
}

export function formatPhone(phone: string): string {
  // 0521234567 → 052-123-4567
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}
