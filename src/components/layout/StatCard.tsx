import { gainBg, gainColor, pct } from "@/lib/format";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface Props {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  delta?: number | null;
  emphasize?: boolean;
}

export default function StatCard({ icon: Icon, label, value, delta, emphasize }: Props) {
  const deltaColor = delta != null ? gainColor(delta) : "text-neutral-500";
  const deltaBg = delta != null ? gainBg(delta) : "bg-neutral-100 dark:bg-neutral-700";

  return (
    <div className={clsx(
      "rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm p-4 transition-transform hover:scale-[1.02]",
      emphasize && "ring-2 ring-blue-500/50"
    )}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />}
        <div className="text-sm text-neutral-500">{label}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {delta != null && (
        <div className={clsx(
          "mt-2 inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full",
          deltaBg,
          deltaColor
        )}>
          <span>{pct(delta)}</span>
        </div>
      )}
    </div>
  );
}
