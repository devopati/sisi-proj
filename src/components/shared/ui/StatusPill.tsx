import { type ProjectStatus } from "../../../types";

const statusColors: Record<ProjectStatus, string> = {
  Pending: "bg-maize/20 text-maize-dark",
  Approved: "bg-lake/12 text-lake",
  "In Progress": "bg-tea-light text-tea",
  Completed: "bg-tea text-white",
  Rejected: "bg-murram/12 text-murram",
};

type StatusPillProps = {
  status: ProjectStatus;
  bgColor?: string; // override the colour picked from the status
};

const StatusPill = ({ status, bgColor }: StatusPillProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${bgColor ?? statusColors[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
};

export default StatusPill;
