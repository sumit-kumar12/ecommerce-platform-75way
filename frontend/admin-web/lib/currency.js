const REGION_TO_CURRENCY = Object.freeze({
  IN: "INR",
  US: "USD",
  GB: "GBP",
  EU: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IE: "EUR",
  AE: "AED",
  SA: "SAR",
  CA: "CAD",
  AU: "AUD",
  SG: "SGD",
  JP: "JPY",
});

const inferCurrencyFromTimeZone = (timeZone) => {
  const normalized = String(timeZone || "").trim();
  if (!normalized) return null;
  if (normalized === "Asia/Kolkata" || normalized === "Asia/Calcutta") return "INR";
  return null;
};

const normalizeRegion = (locale) => {
  if (!locale) return null;
  try {
    const parsed = new Intl.Locale(locale).maximize();
    if (parsed?.region) return parsed.region.toUpperCase();
  } catch {
    // no-op
  }

  const match = /-([A-Za-z]{2})(?:$|[^A-Za-z])/.exec(locale);
  return match ? match[1].toUpperCase() : null;
};

export const detectCurrencyPreferences = () => {
  if (typeof window === "undefined") {
    return { locale: "en-IN", currency: "INR" };
  }

  const preferredLocale = navigator.languages?.[0] || navigator.language || "en-IN";
  let locale = preferredLocale;
  const region = normalizeRegion(locale);
  const regionCurrency = (region && REGION_TO_CURRENCY[region]) || null;
  const timeZoneCurrency = inferCurrencyFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Prefer timezone-derived currency when locale is misleading (example: en-US on an India-based machine).
  const currency =
    (regionCurrency === "USD" && timeZoneCurrency && timeZoneCurrency !== "USD" ? timeZoneCurrency : regionCurrency) ||
    timeZoneCurrency ||
    "INR";

  if (currency === "INR" && !/-IN(?:$|[^A-Za-z])/i.test(locale)) {
    locale = "en-IN";
  }

  return { locale, currency };
};

export const formatCurrencyValue = (value, { currency = "INR", locale = "en-IN" } = {}) => {
  const amount = Number(value || 0);
  const normalized = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(normalized);
};
