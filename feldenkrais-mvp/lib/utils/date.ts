export function formatDateOnly(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function todayDateString(): string {
  return formatDateOnly(new Date());
}

export function formatMonthDayLabel(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? parseDateOnly(dateInput) : dateInput;
  return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}
