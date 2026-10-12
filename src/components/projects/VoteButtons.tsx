import { useVote } from "../../hooks/useVote";
import { type Votes } from "../../types";
import { formatNumber } from "../../utils/format";

type VoteButtonsProps = {
  projectId: number;
  initialVotes: Votes;
};

const baseClass =
  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60";

const VoteButtons = ({ projectId, initialVotes }: VoteButtonsProps) => {
  const { votes, myVote, sending, error, vote } = useVote(projectId, initialVotes);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => vote("support")}
          disabled={sending}
          aria-pressed={myVote === "support"}
          className={`${baseClass} ${
            myVote === "support" ? "border-tea bg-tea text-white" : "border-line bg-white hover:border-tea hover:text-tea"
          }`}
        >
          Support <span className="tabular-nums">{formatNumber(votes.support)}</span>
        </button>
        <button
          type="button"
          onClick={() => vote("reject")}
          disabled={sending}
          aria-pressed={myVote === "reject"}
          className={`${baseClass} ${
            myVote === "reject"
              ? "border-murram bg-murram text-white"
              : "border-line bg-white hover:border-murram hover:text-murram"
          }`}
        >
          Reject <span className="tabular-nums">{formatNumber(votes.reject)}</span>
        </button>
      </div>
      {myVote && (
        <p role="status" className="text-sm text-muted">
          You voted to {myVote}. Click the other button to change your vote.
        </p>
      )}
      {error && <p className="text-sm text-murram">{error}</p>}
    </div>
  );
};

export default VoteButtons;
