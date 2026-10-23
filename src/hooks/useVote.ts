
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { api, ApiError } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

type Choice = "support" | "reject";

type PendingVote = {
  userId: number;
  projectId: number;
  choice: Choice;
};

const QUEUE_KEY = "sisi-pending-votes";

// Prevent several mounted project cards from syncing the same queue at once.
let syncing = false;

const readQueue = (): PendingVote[] => {
  try {
    const saved = localStorage.getItem(QUEUE_KEY);
    return saved ? (JSON.parse(saved) as PendingVote[]) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue: PendingVote[]) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

const queueVote = (vote: PendingVote) => {
  const queue = readQueue().filter(
    (item) =>
      item.userId !== vote.userId || item.projectId !== vote.projectId,
  );

  queue.push(vote);
  saveQueue(queue);
};

const removeQueuedVote = (vote: PendingVote) => {
  const queue = readQueue().filter(
    (item) =>
      item.userId !== vote.userId ||
      item.projectId !== vote.projectId ||
      item.choice !== vote.choice,
  );

  saveQueue(queue);
};

export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [votes, setVotes] = useState(initialVotes);
  const voteStorageKey = `vote-${user?.id ?? "anonymous"}-${projectId}`;
  const [myVote, setMyVote] = useLocalStorage<Choice | null>(
    voteStorageKey,
    null,
  );

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(() =>
    user
      ? readQueue().some(
          (item) =>
            item.userId === user.id && item.projectId === projectId,
        )
      : false,
  );

  const syncPendingVotes = useCallback(async () => {
    if (!user || !navigator.onLine || syncing) return;

    syncing = true;

    try {
      const queue = readQueue().filter(
        (item) => item.userId === user.id,
      );

      for (const item of queue) {
        try {
          const result = await api<VoteResult>(
            `/projects/${item.projectId}/vote`,
            {
              method: "POST",
              body: { choice: item.choice },
              token: user.token,
            },
          );

          removeQueuedVote(item);

          if (item.projectId === projectId) {
            setVotes(result.votes);
            setMyVote(result.myVote);
            setPending(false);
            setError("");
          }
        } catch {
          // Keep the failed vote for another attempt.
          // Stop here to avoid repeatedly hitting an unavailable API.
          break;
        }
      }
    } finally {
      syncing = false;

      const stillPending = readQueue().some(
        (item) =>
          item.userId === user.id && item.projectId === projectId,
      );

      setPending(stillPending);
    }
  }, [user, projectId, setMyVote]);

  useEffect(() => {
    if (!user) {
      return;
    }

    void syncPendingVotes();

    const handleOnline = () => {
      void syncPendingVotes();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [user, projectId, syncPendingVotes]);

  const vote = async (choice: Choice) => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
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
      removeQueuedVote({
        userId: user.id,
        projectId,
        choice,
      });
      setPending(false);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 0) {
        queueVote({
          userId: user.id,
          projectId,
          choice,
        });

        // Show the user's intended choice, but clearly label it as pending.
        setMyVote(choice);
        setPending(true);
        setError("Will send when you're back online.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Your vote could not be submitted. Please try again.",
        );
      }
    } finally {
      setSending(false);
    }
  };

  return {
    votes,
    myVote,
    sending,
    error,
    pending: user ? pending : false,
    vote,
  };
};
