import { Link } from "react-router";
import { type Stats } from "../../types";
import { formatKES, formatShortKES } from "../../utils/format";

// One bar per ward. Bar length = money committed; the dark part = money spent.
const WardSpending = ({ byWard }: { byWard: Stats["byWard"] }) => {
  const largestBudget = Math.max(...byWard.map((ward) => ward.budget), 1);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <span className="flex items-center gap-2">
          <span className="h-3 w-5 rounded-sm bg-tea" aria-hidden /> Spent
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-5 rounded-sm bg-tea/25" aria-hidden /> Committed, not yet spent
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {byWard.map((ward) => {
          const spentWidth = (ward.spent / largestBudget) * 100;
          const remainingWidth = ((ward.budget - ward.spent) / largestBudget) * 100;
          return (
            <li key={ward.id} className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-4">
              <Link to={`/wards/${ward.id}`} className="font-semibold underline-offset-4 hover:text-tea hover:underline">
                {ward.name}
              </Link>
              <div className="flex flex-col gap-1">
                <div
                  className="flex h-4 gap-0.5"
                  title={`${ward.name}: ${formatKES(ward.spent)} spent of ${formatKES(ward.budget)} committed`}
                >
                  {ward.spent > 0 && <div className="h-full rounded bg-tea" style={{ width: `${spentWidth}%` }} />}
                  {ward.budget > ward.spent && (
                    <div className="h-full rounded bg-tea/25" style={{ width: `${remainingWidth}%` }} />
                  )}
                </div>
                <p className="text-sm text-muted tabular-nums">
                  {formatShortKES(ward.spent)} spent of {formatShortKES(ward.budget)} committed
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WardSpending;
