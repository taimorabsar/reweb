"use client";

import { MAJOR_CITIES, OTHER_CITIES } from "@/lib/cities";

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  emptyLabel: string;
  id?: string;
  className?: string;
}

export default function CitySelect({
  value,
  onChange,
  emptyLabel,
  id,
  className = "input-field",
}: CitySelectProps) {
  // Keeps older listings (e.g. a city not in the list) visible instead of blank.
  const isUnlisted =
    value !== "" && !MAJOR_CITIES.includes(value) && !OTHER_CITIES.includes(value);

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      <option value="">{emptyLabel}</option>
      {isUnlisted && <option value={value}>{value}</option>}
      <optgroup label="Major cities">
        {MAJOR_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </optgroup>
      <optgroup label="Other cities">
        {OTHER_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </optgroup>
    </select>
  );
}