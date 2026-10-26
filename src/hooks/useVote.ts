import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { ApiError, api } from "../utils/api";
import { queueVote, readQueuedVotes, syncQueuedVotes, type VoteChoice } from "../utils/offlineVotes";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

// Voting needs a logged-in user. Visitors are sent to the login page and brought back afterwards.
export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storageKey = user ? `vote-${user.id}-${projectId}` : `vote-guest-${projectId}`;
  const [votes, setVotes] = useState(initialVotes);
  const [myVote, setMyVote] = useLocalStorage<VoteChoice | null>(storageKey, null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [queued, setQueued] = useState(() =>
    user ? readQueuedVotes(user.id).some((vote) => vote.projectId === projectId) : false,
  );

  useEffect(() => {
    if (!user) return;

    const updateQueued = () => {
      setQueued(readQueuedVotes(user.id).some((vote) => vote.projectId === projectId));
    };
    const handleSynced = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: number; projectId: number; result: VoteResult }>).detail;
      if (detail.userId !== user.id || detail.projectId !== projectId) return;
      setVotes(detail.result.votes);
      updateQueued();
    };
    const handleSyncError = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: number; message: string }>).detail;
      if (detail.userId === user.id) setError(detail.message);
    };

    window.addEventListener("sisi-vote-queue-change", updateQueued);
    window.addEventListener("sisi-vote-synced", handleSynced);
    window.addEventListener("sisi-vote-sync-error", handleSyncError);

    return () => {
      window.removeEventListener("sisi-vote-queue-change", updateQueued);
      window.removeEventListener("sisi-vote-synced", handleSynced);
      window.removeEventListener("sisi-vote-sync-error", handleSyncError);
    };
  }, [projectId, user]);

  const vote = async (choice: VoteChoice): Promise<"sent" | "queued" | false> => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }

    const saveForLater = () => {
      queueVote(user.id, projectId, choice);
      setMyVote(choice);
      setQueued(true);
      setError("");
      return "queued" as const;
    };

    if (!navigator.onLine || readQueuedVotes(user.id).length > 0) {
      const result = saveForLater();
      if (navigator.onLine) {
        void syncQueuedVotes(user.id, user.token).catch((err: unknown) => {
          window.dispatchEvent(
            new CustomEvent("sisi-vote-sync-error", {
              detail: {
                userId: user.id,
                message: err instanceof Error ? err.message : "Could not sync your saved vote.",
              },
            }),
          );
        });
      }
      return result;
    }

    setSending(true);
    setError("");
    try {
      const result = await api<VoteResult>(`/projects/${projectId}/vote`, {
        method: "POST",
        body: { choice },
        token: user.token,
      });
      setVotes(result.votes);
      setMyVote(result.myVote);
      return "sent";
    } catch (err) {
      if ((err instanceof ApiError && err.status === 0) || !navigator.onLine) {
        return saveForLater();
      }
      setError((err as Error).message);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { votes, myVote, sending, error, queued, vote };
};
