export function formatCurrency(
  amount: number,
  currency: "USD" | "NGN" = "USD"
): string {
  const locale = currency === "USD" ? "en-US" : "en-NG";
  const currencyCode = currency === "USD" ? "USD" : "NGN";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// For backward compatibility
export function formatNaira(amount: number): string {
  return formatCurrency(amount, "NGN");
}
