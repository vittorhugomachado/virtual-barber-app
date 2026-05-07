export function formatPhone(phone: string) {
  const rawDigits = phone.replace(/\D/g, "");
  const digits = rawDigits.startsWith("55") && rawDigits.length > 11
    ? rawDigits.slice(2, 13)
    : rawDigits.slice(0, 11);

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
