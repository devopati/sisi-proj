import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

type Choice = "support" | "reject";

// Voting needs a logged-in user. Visitors are sent to the login page and brought back afterwards.
export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storageKey = user ? `vote-${user.id}-${projectId}` : `vote-guest-${projectId}`;
  const [votes, setVotes] = useState(initialVotes);
  const [myVote, setMyVote] = useLocalStorage<Choice | null>(storageKey, null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const vote = async (choice: Choice) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return false;
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
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { votes, myVote, sending, error, vote };
};
