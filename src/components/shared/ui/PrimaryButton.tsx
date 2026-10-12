type PrimaryButtonProps = {
  title: string;
  onClick?: () => void;
  bgColor?: string; // any Tailwind background class, e.g. "bg-murram"
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

const PrimaryButton = ({
  title,
  onClick,
  bgColor = "bg-tea",
  type = "button",
  disabled = false,
  className = "",
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${bgColor} rounded-lg px-5 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
