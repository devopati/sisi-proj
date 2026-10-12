import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import LinkButton from "../ui/LinkButton";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/wards", label: "Wards" },
  { to: "/participate", label: "Participate" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 font-medium transition ${isActive ? "bg-tea-light text-tea-dark" : "hover:text-tea"}`;

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogOut = () => {
    signOut();
    closeMenu();
    navigate("/");
  };

  const authLinks = user ? (
    <>
      <span className="text-sm text-muted">
        Logged in as <strong className="text-ink">{user.name}</strong>
      </span>
      <button type="button" onClick={handleLogOut} className="rounded-md px-3 py-2 font-semibold text-tea hover:bg-tea-light">
        Log out
      </button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={closeMenu} className="rounded-md px-3 py-2 font-semibold text-tea hover:bg-tea-light">
        Log in
      </Link>
      <LinkButton to="/register" title="Register" onClick={closeMenu} />
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" onClick={closeMenu} className="flex items-baseline gap-2">
          <span className="type-display text-2xl text-tea">SISI</span>
          <span className="text-sm text-muted">Sisi County</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{authLinks}</div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="rounded-md border border-line px-3 py-2 font-semibold lg:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line px-4 pb-5 lg:hidden">
          <nav aria-label="Main" className="flex flex-col py-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={closeMenu} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">{authLinks}</div>
        </div>
      )}
    </header>
  );
};

export default Header;
