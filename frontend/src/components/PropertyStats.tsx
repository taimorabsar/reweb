interface PropertyStatsProps {
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  size?: "sm" | "lg";
}

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function BedIcon({ className }: { className: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M3 19V6" />
      <path d="M3 15h18" />
      <path d="M21 19v-6a3 3 0 00-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.6" />
    </svg>
  );
}

function BathIcon({ className }: { className: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3z" />
      <path d="M6 12V6a2 2 0 012-2h1" />
      <path d="M7 19l-1 2M17 19l1 2" />
    </svg>
  );
}

function AreaIcon({ className }: { className: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

export default function PropertyStats({
  bedrooms,
  bathrooms,
  areaSqFt,
  size = "sm",
}: PropertyStatsProps) {
  const iconClass = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  const valueClass = size === "lg" ? "text-base font-semibold" : "text-sm font-semibold";
  const labelClass = size === "lg" ? "text-xs text-gray-500" : "text-[11px] text-gray-500";

  return (
    <div className="flex items-start gap-6 text-primary-700">
      {bedrooms > 0 && (
        <div className="flex flex-col items-center gap-0.5">
          <BedIcon className={iconClass} />
          <span className={`${valueClass} text-gray-900`}>{bedrooms}</span>
          <span className={labelClass}>Bedrooms</span>
        </div>
      )}
      {bathrooms > 0 && (
        <div className="flex flex-col items-center gap-0.5">
          <BathIcon className={iconClass} />
          <span className={`${valueClass} text-gray-900`}>{bathrooms}</span>
          <span className={labelClass}>Bathrooms</span>
        </div>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <AreaIcon className={iconClass} />
        <span className={`${valueClass} text-gray-900`}>{areaSqFt.toLocaleString("en-PK")}</span>
        <span className={labelClass}>Sq ft</span>
      </div>
    </div>
  );
}