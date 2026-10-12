import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { type Votes, type VoteResult } from "../types";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";

type Choice = "support" | "reject";

// Voting needs a logged-in user. Visitors are sent to the login page and brought back afterwards.
export const useVote = (projectId: number, initialVotes: Votes) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [votes, setVotes] = useState(initialVotes);
  const [myVote, setMyVote] = useState<Choice | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const vote = async (choice: Choice) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return { votes, myVote, sending, error, vote };
};
