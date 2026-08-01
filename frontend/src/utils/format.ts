export function formatAED(value: string | number | null | undefined): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  if (Number.isNaN(n)) return "AED 0";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatAEDPrecise(value: string | number | null | undefined): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  if (Number.isNaN(n)) return "AED 0.00";
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(n);
}

export const STATUS_COLORS: Record<string, "default" | "success" | "warning" | "error" | "info" | "primary"> = {
  available: "success",
  reserved: "warning",
  sold: "default",
  in_transit: "info",
  draft: "default",
  sent: "info",
  approved: "success",
  rejected: "error",
  converted: "warning",
};

export const BRANDS = ["Shacman", "Sinotruk HOWO", "FAW", "Dongfeng", "Foton", "JAC"];
export const CATEGORIES = ["tipper", "tractor", "cargo", "mixer", "tanker", "flatbed"];
export const AVAILABILITIES = ["available", "reserved", "sold", "in_transit"];
export const QUOTE_STATUSES = ["draft", "sent", "approved", "rejected", "converted"];
