export const FAVORITES_MESSAGES = {
  title: "Favorite Cities",
  subtitle:
    "Keep track of the weather in your most frequented locations. Click a card to see detailed forecasts.",
  searchPlaceholder: "Search saved locations...",
  addLocation: "Add Location",
  addLocationSub: "EXPAND YOUR HORIZONS",
  addSearchPlaceholder: "Enter city name...",
  dailyInsightBadge: "DAILY INSIGHT",
  dailyInsightTitle: "Best Travel Conditions",
  dailyInsightButton: "VIEW TRAVEL MAP",
  loading: "Loading favorites…",
  noFavorites: "No favorite cities yet",
  noFavoritesHint: "Add cities from the Details page to start tracking them here.",
  signInRequired: "Sign in to manage favorites",
  addCancelButton: "Cancel",
  insightNoCities: "Add more cities to get personalized travel condition insights.",
  insightIsExperiencing: "is experiencing",
  insightLessIdeal: ", making it less ideal for outdoor activities today.",
} as const;

export const REGION_FILTERS = [
  { id: "ALL", label: "ALL" },
  { id: "EUROPE", label: "EUROPE" },
  { id: "NORTH_AMERICA", label: "NORTH AMERICA" },
  { id: "ASIA", label: "ASIA" },
] as const;

export type RegionId = (typeof REGION_FILTERS)[number]["id"];

const EUROPE_CODES = new Set([
  "GB",
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "PL",
  "PT",
  "SE",
  "NO",
  "DK",
  "FI",
  "CH",
  "AT",
  "BE",
  "CZ",
  "UA",
  "RO",
  "HU",
  "GR",
  "BG",
  "HR",
  "SK",
  "SI",
  "EE",
  "LV",
  "LT",
  "IE",
  "LU",
  "MT",
  "CY",
  "IS",
]);
const NA_CODES = new Set(["US", "CA", "MX"]);
const ASIA_CODES = new Set([
  "JP",
  "CN",
  "KR",
  "IN",
  "TH",
  "SG",
  "AE",
  "SA",
  "TR",
  "ID",
  "MY",
  "PH",
  "VN",
  "PK",
  "BD",
  "IR",
  "IQ",
  "IL",
  "JO",
  "KW",
  "QA",
  "OM",
  "HK",
  "TW",
  "MN",
  "KZ",
  "UZ",
]);

export function getRegion(countryCode: string): RegionId {
  if (EUROPE_CODES.has(countryCode)) return "EUROPE";
  if (NA_CODES.has(countryCode)) return "NORTH_AMERICA";
  if (ASIA_CODES.has(countryCode)) return "ASIA";
  return "ALL";
}

export function getLocalTime(timezoneOffsetSeconds: number): string {
  const localMs = Date.now() + timezoneOffsetSeconds * 1000;
  const local = new Date(localMs);
  const h = local.getUTCHours().toString().padStart(2, "0");
  const m = local.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
