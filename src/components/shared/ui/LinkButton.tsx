import { Link } from "react-router";

type LinkButtonProps = {
  to: string;
  title: string;
  variant?: "solid" | "outline" | "light";
  onClick?: () => void;
};

const variants = {
  solid: "bg-tea text-white hover:bg-tea-dark",
  outline: "border border-tea text-tea hover:bg-tea-light",
  light: "bg-white text-tea-dark hover:bg-tea-light",
};

// Looks like a button, but navigates like a link
const LinkButton = ({ to, title, variant = "solid", onClick }: LinkButtonProps) => {
  return (
    <Link to={to} onClick={onClick} className={`inline-block rounded-lg px-5 py-2.5 font-semibold transition ${variants[variant]}`}>
      {title}
    </Link>
  );
};

export default LinkButton;
