import { type Milestone } from "../../types";

const MilestoneList = ({ milestones }: { milestones: Milestone[] }) => {
  const doneCount = milestones.filter((milestone) => milestone.done).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-muted">
        {doneCount} of {milestones.length} milestones done
      </p>
      <ol className="flex flex-col">
        {milestones.map((milestone, index) => (
          <li key={milestone.title} className="relative flex gap-4 pb-6 last:pb-0">
            {index < milestones.length - 1 && (
              <span className="absolute top-8 bottom-0 left-3.5 w-px bg-line" aria-hidden />
            )}
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                milestone.done ? "bg-tea text-white" : "border-2 border-line bg-white text-muted"
              }`}
              aria-hidden
            >
              {milestone.done ? "✓" : index + 1}
            </span>
            <div className="pt-0.5">
              <p className={milestone.done ? "font-semibold" : ""}>{milestone.title}</p>
              <p className="text-sm text-muted">{milestone.done ? "Done" : "Not done yet"}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MilestoneList;
