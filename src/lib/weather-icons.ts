// Maps OpenWeather condition code ranges to Material Symbols icon names
const CONDITION_ICON_MAP: Array<{ min: number; max: number; icon: string }> = [
  { min: 200, max: 299, icon: "thunderstorm" },
  { min: 300, max: 499, icon: "rainy" },
  { min: 500, max: 599, icon: "rainy" },
  { min: 600, max: 699, icon: "ac_unit" },
  { min: 700, max: 799, icon: "foggy" },
  { min: 800, max: 800, icon: "sunny" },
  { min: 801, max: 899, icon: "cloud" },
];

export function getConditionIcon(conditionCode: number): string {
  const match = CONDITION_ICON_MAP.find(
    ({ min, max }) => conditionCode >= min && conditionCode <= max
  );
  return match?.icon ?? "cloud";
}
