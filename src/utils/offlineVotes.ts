import { type VoteResult } from "../types";
import { api } from "./api";

export type VoteChoice = "support" | "reject";

type QueuedVote = {
  id: string;
  projectId: number;
  choice: VoteChoice;
};

type VoteSyncedEvent = CustomEvent<{
  userId: number;
  projectId: number;
  result: VoteResult;
}>;

const getQueueKey = (userId: number) => `sisi-offline-votes-${userId}`;
const activeSyncs = new Map<number, Promise<void>>();

const isQueuedVote = (value: unknown): value is QueuedVote => {
  if (typeof value !== "object" || value === null) return false;
  const vote = value as Partial<QueuedVote>;
  return (
    typeof vote.id === "string" &&
    typeof vote.projectId === "number" &&
    (vote.choice === "support" || vote.choice === "reject")
  );
};

export const readQueuedVotes = (userId: number): QueuedVote[] => {
  const key = getQueueKey(userId);
  const value = window.localStorage.getItem(key);
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || !parsed.every(isQueuedVote)) {
      throw new Error("The saved offline vote queue has an invalid format.");
    }
    return parsed;
  } catch (error) {
    console.error("Could not read the saved offline vote queue:", error);
    window.localStorage.removeItem(key);
    return [];
  }
};

const saveQueue = (userId: number, votes: QueuedVote[]) => {
  const key = getQueueKey(userId);
  if (votes.length === 0) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, JSON.stringify(votes));
  window.dispatchEvent(new Event("sisi-vote-queue-change"));
};

export const queueVote = (userId: number, projectId: number, choice: VoteChoice) => {
  const vote: QueuedVote = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    projectId,
    choice,
  };
  saveQueue(userId, [...readQueuedVotes(userId), vote]);
};

export const syncQueuedVotes = (userId: number, token: string): Promise<void> => {
  const activeSync = activeSyncs.get(userId);
  if (activeSync) return activeSync;

  const sync = (async () => {
    for (const vote of readQueuedVotes(userId)) {
      const result = await api<VoteResult>(`/projects/${vote.projectId}/vote`, {
        method: "POST",
        body: { choice: vote.choice },
        token,
      });
      saveQueue(
        userId,
        readQueuedVotes(userId).filter((queuedVote) => queuedVote.id !== vote.id),
      );
      window.dispatchEvent(
        new CustomEvent("sisi-vote-synced", {
          detail: { userId, projectId: vote.projectId, result },
        }) satisfies VoteSyncedEvent,
      );
    }
  })().finally(() => {
    activeSyncs.delete(userId);
  });

  activeSyncs.set(userId, sync);
  return sync;
};
