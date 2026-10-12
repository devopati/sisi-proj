type ProgressBarProps = {
  value: number; // 0 to 100
  label: string; // read out by screen readers and shown on hover
  size?: "sm" | "lg";
};

// A meter: dark tea fill on a light tea track
const ProgressBar = ({ value, label, size = "sm" }: ProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      title={label}
      className={`w-full overflow-hidden rounded bg-tea-light ${size === "lg" ? "h-3" : "h-1.5"}`}
    >
      <div className="h-full rounded bg-tea transition-[width] duration-700" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default ProgressBar;
