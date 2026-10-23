import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { useInstallPrompt } from "../../../hooks/useInstallPrompt";
import LinkButton from "../ui/LinkButton";
import OfflineBanner from "./OfflineBanner";
import { useToast } from "../../../contexts/ToastContext";
import { useTheme } from "../../../contexts/ThemeContext";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/wards", label: "Wards" },
  { to: "/participate", label: "Participate" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 font-medium transition ${
    isActive ? "bg-tea-light text-tea-dark" : "hover:text-tea"
  }`;

const Header = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { canInstall, install } = useInstallPrompt();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogOut = () => {
    signOut();
    closeMenu();
    showToast("Logged out");
    navigate("/");
  };

  const installButton = canInstall ? (
    <button
      type="button"
      onClick={install}
      className="rounded-md border border-tea px-3 py-2 text-sm font-medium text-tea hover:bg-tea-light"
    >
      Install app
    </button>
  ) : null;

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md border border-tea px-3 py-2 text-sm font-medium text-tea hover:bg-tea-light"
    >
      Switch to {theme === "dark" ? "light" : "dark"} mode
    </button>
  );

  const authLinks = user ? (
    <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
      <span className="text-sm text-muted">Logged in as {user.name}</span>

      <button
        type="button"
        onClick={handleLogOut}
        className="rounded-md px-3 py-2 text-sm font-medium hover:text-tea"
      >
        Log out
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-2 lg:flex-row">
      <LinkButton to="/login" title="Login" variant="outline" />

      <LinkButton to="/register" title="Register" variant="solid" />
    </div>
  );

  return (
    <header className="border-b border-line bg-white dark:bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold text-tea-dark"
        >
          SISI
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}

          {user && (
            <NavLink to="/my-proposals" className={navClass}>
              My proposals
            </NavLink>
          )}
        </nav>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {themeButton}
          {installButton}
          {authLinks}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-md border border-line px-3 py-2 text-sm font-medium lg:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line px-4 py-4 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={navClass}
              >
                {link.label}
              </NavLink>
            ))}

            {user && (
              <NavLink
                to="/my-proposals"
                onClick={closeMenu}
                className={navClass}
              >
                My proposals
              </NavLink>
            )}
          </nav>

          <div className="mt-4 flex flex-col items-start gap-3 border-t border-line pt-4">
            {themeButton}
            {installButton}
            {authLinks}
          </div>
        </div>
      )}

      <OfflineBanner />
    </header>
  );
};

export default Header;
