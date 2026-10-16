import { useVote } from "../../hooks/useVote";
import { useNotifications } from "../../hooks/useNotifications"; // 1. Import the notification hook
import { type Votes } from "../../types";
import { formatNumber } from "../../utils/format";

type VoteButtonsProps = {
  projectId: number;
  initialVotes: Votes;
};

const baseClass =
  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60";

const VoteButtons = ({ projectId, initialVotes }: VoteButtonsProps) => {
  // 2. Destructure isOfflineVote to know if the vote was queued or sent immediately
  const { votes, myVote, sending, error, vote, isOfflineVote } = useVote(
    projectId,
    initialVotes,
  );
  const { permission, requestPermission, sendNotification } =
    useNotifications();

  // 3. Wrapper function to handle voting and subsequent notifications
  const handleVote = async (choice: "support" | "reject") => {
    // Perform the vote (this handles both online and offline queuing)
    await vote(choice);

    // Only trigger the notification flow if it was a successful, immediate online vote
    if (!isOfflineVote && !error) {
      if (permission === "default") {
        // Contextual permission request: only ask because they just took a meaningful action
        const result = await requestPermission();
        if (result === "granted") {
          sendNotification(
            "Vote Recorded! 🗳️",
            `You successfully voted to ${choice} this project.`,
          );
        }
      } else if (permission === "granted") {
        // If they already granted permission previously, just send it
        sendNotification(
          "Vote Recorded! 🗳️",
          `You successfully voted to ${choice} this project.`,
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleVote("support")} // 4. Use the wrapper function
          disabled={sending}
          aria-pressed={myVote === "support"}
          className={`${baseClass} ${
            myVote === "support"
              ? "border-tea bg-tea text-white"
              : "border-line bg-white hover:border-tea hover:text-tea"
          }`}
        >
          Support{" "}
          <span className="tabular-nums">{formatNumber(votes.support)}</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote("reject")} // 4. Use the wrapper function
          disabled={sending}
          aria-pressed={myVote === "reject"}
          className={`${baseClass} ${
            myVote === "reject"
              ? "border-murram bg-murram text-white"
              : "border-line bg-white hover:border-murram hover:text-murram"
          }`}
        >
          Reject{" "}
          <span className="tabular-nums">{formatNumber(votes.reject)}</span>
        </button>
      </div>

      {myVote && (
        <p role="status" className="text-sm text-muted">
          You voted to {myVote}. Click the other button to change your vote.
        </p>
      )}

      {/* This will show the "Will send when you're back online" message if offline */}
      {error && <p className="text-sm text-murram">{error}</p>}
    </div>
  );
};

export default VoteButtons;
