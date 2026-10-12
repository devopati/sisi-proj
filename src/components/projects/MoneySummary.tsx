import { type Stats } from "../../types";
import { formatKES } from "../../utils/format";
import ProgressBar from "../shared/ui/ProgressBar";

// "Ksh 19,400,000 spent of Ksh 36,300,000 committed", with a meter
const MoneySummary = ({ stats }: { stats: Stats }) => {
  const { allocated, spent, percentSpent } = stats.budget;
  const { byStatus } = stats.projects;
  const fundedCount = byStatus.Approved + byStatus["In Progress"] + byStatus.Completed;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6">
      <p className="text-muted">Spent so far</p>
      <p className="text-4xl font-bold tabular-nums md:text-5xl">{formatKES(spent)}</p>
      <ProgressBar value={percentSpent} size="lg" label={`${percentSpent}% of committed money spent`} />
      <p className="text-muted">
        That's {percentSpent}% of the {formatKES(allocated)} committed to {fundedCount} approved projects.
      </p>
    </div>
  );
};

export default MoneySummary;
