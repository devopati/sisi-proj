import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import localforage from "localforage"; // 1. Import localforage
import { type Votes, type VoteResult } from "../types";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";

type Choice = "support" | "reject";

const PENDING_VOTES_KEY = "sisi-pending-votes";

// 2. Define the shape of our queued vote items
type VoteQueueItem = {
  projectId: number;
  choice: Choice;
  token: string;
};

// Voting needs a logged-in user. Visitors are sent to the login page and brought back afterwards.
export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [votes, setVotes] = useState(initialVotes);
  const [myVote, setMyVote] = useState<Choice | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [isOfflineVote, setIsOfflineVote] = useState(false);

  // 3. Helper function to sync votes (used by both 'online' event and Background Sync)
  const syncPendingVotes = async () => {
    const pending =
      (await localforage.getItem<VoteQueueItem[]>(PENDING_VOTES_KEY)) || [];
    if (pending.length === 0) return;

    // Clear the queue optimistically to prevent duplicate sends
    await localforage.removeItem(PENDING_VOTES_KEY);

    const failedVotes: VoteQueueItem[] = [];
    for (const vote of pending) {
      try {
        await api<VoteResult>(`/projects/${vote.projectId}/vote`, {
          method: "POST",
          body: { choice: vote.choice },
          token: vote.token,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // If it fails (e.g., temporary glitch), push it back to the queue
        failedVotes.push(vote);
      }
    }

    // Save any votes that failed to send back to the queue
    if (failedVotes.length > 0) {
      await localforage.setItem(PENDING_VOTES_KEY, failedVotes);
    }
  };

  // Listen for the browser coming back online to sync queued votes
  useEffect(() => {
    const handleOnline = async () => {
      await syncPendingVotes();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const vote = async (choice: Choice) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // 4. Handle Offline State
    if (!navigator.onLine) {
      const pending =
        (await localforage.getItem<VoteQueueItem[]>(PENDING_VOTES_KEY)) || [];
      pending.push({ projectId, choice, token: user.token });
      await localforage.setItem(PENDING_VOTES_KEY, pending);

      setError("Will send when you're back online");
      setIsOfflineVote(true);

      // 5. Register Background Sync!
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (
            registration as ServiceWorkerRegistration & {
              sync: { register: (tag: string) => Promise<void> };
            }
          ).sync.register("sync-votes");
        } catch (err) {
          console.warn("Background Sync registration failed:", err);
        }
      }
      return;
    }

    // 6. Handle Online State
    setSending(true);
    setError("");
    setIsOfflineVote(false);

    try {
      const result = await api<VoteResult>(`/projects/${projectId}/vote`, {
        method: "POST",
        body: { choice },
        token: user.token,
      });
      setVotes(result.votes);
      setMyVote(result.myVote);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return { votes, myVote, sending, error, vote, isOfflineVote };
};
