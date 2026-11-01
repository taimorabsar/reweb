export const FEATURE_OPTIONS: { value: string; label: string }[] = [
  { value: "GAS", label: "Gas" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "WATER_SUPPLY", label: "Water supply" },
  { value: "BOUNDARY_WALL", label: "Boundary wall" },
  { value: "SERVANT_QUARTER", label: "Servant quarter" },
  { value: "LAWN", label: "Lawn / garden" },
  { value: "SECURITY", label: "Security" },
  { value: "ELEVATOR", label: "Elevator" },
  { value: "BACKUP_POWER", label: "Backup power" },
  { value: "BALCONY", label: "Balcony" },
];

export function getFeatureLabel(code: string): string {
  return FEATURE_OPTIONS.find((f) => f.value === code)?.label ?? code;
}