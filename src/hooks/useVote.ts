import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";

type Choice = "support" | "reject";

const PENDING_VOTES_KEY = "sisi-pending-votes";

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

  // Listen for the browser coming back online to sync queued votes
  useEffect(() => {
    const handleOnline = async () => {
      const pending = JSON.parse(
        localStorage.getItem(PENDING_VOTES_KEY) || "[]",
      );
      if (pending.length === 0) return;

      // Clear the queue optimistically to prevent duplicate sends
      localStorage.removeItem(PENDING_VOTES_KEY);

      const failedVotes = [];
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
        localStorage.setItem(PENDING_VOTES_KEY, JSON.stringify(failedVotes));
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const vote = async (choice: Choice) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // 1. Handle Offline State
    if (!navigator.onLine) {
      const pending = JSON.parse(
        localStorage.getItem(PENDING_VOTES_KEY) || "[]",
      );
      pending.push({ projectId, choice, token: user.token });
      localStorage.setItem(PENDING_VOTES_KEY, JSON.stringify(pending));

      setError("Will send when you're back online");
      setIsOfflineVote(true);

      // Optional: Optimistically update the UI so the user sees their vote immediately
      // setMyVote(choice);
      // setVotes(prev => ({ ...prev, [choice]: (prev[choice] || 0) + 1 }));
      return;
    }

    // 2. Handle Online State
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
