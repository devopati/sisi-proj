import { Link } from "react-router";
import { type Ward } from "../../types";
import { formatNumber, formatShortKES } from "../../utils/format";
import Contours from "../shared/ui/Contours";
import ProgressBar from "../shared/ui/ProgressBar";

const WardDisplayCard = ({ ward }: { ward: Ward }) => {
  const percentSpent = ward.budget ? Math.round((ward.spent / ward.budget) * 100) : 0;

  return (
    <Link
      to={`/wards/${ward.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:border-tea"
    >
      <div className="relative h-36 overflow-hidden bg-tea-dark text-white">
        <Contours seed={ward.id + 10} className="absolute inset-0 size-full text-white/15" />
        <h3 className="type-display absolute bottom-4 left-5 text-4xl transition group-hover:text-tea-light">
          {ward.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-muted">{ward.description}</p>

        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-muted">Residents</dt>
            <dd className="font-semibold tabular-nums">{formatNumber(ward.population)}</dd>
          </div>
          <div>
            <dt className="text-muted">Area</dt>
            <dd className="font-semibold tabular-nums">{ward.areaKm2} km²</dd>
          </div>
          <div>
            <dt className="text-muted">Projects</dt>
            <dd className="font-semibold tabular-nums">{ward.projectCount}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-col gap-1.5 text-sm">
          <p>
            {formatShortKES(ward.budget)} committed, {percentSpent}% spent
          </p>
          <ProgressBar value={percentSpent} label={`${percentSpent}% of ${ward.name}'s committed money spent`} />
        </div>
      </div>
    </Link>
  );
};

export default WardDisplayCard;
