export function isRainy(conditionCode: number): boolean {
  return conditionCode >= 200 && conditionCode < 700;
}

export function isStormy(conditionCode: number): boolean {
  return conditionCode >= 200 && conditionCode < 300;
}
