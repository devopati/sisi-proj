import { Link } from "react-router";
import { useFetch } from "../../../hooks/useFetch";
import { type County } from "../../../types";

const Footer = () => {
  const { data: county } = useFetch<County>("/county");

  return (
    <footer className="mt-24 bg-tea-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="type-display text-3xl">SISI</p>
          <p className="mt-3 max-w-xs text-white/75">Propose, vote on and follow public projects in Sisi County.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <p className="mb-1 font-semibold">Take part</p>
          <Link to="/projects" className="text-white/75 hover:text-white">
            Browse projects
          </Link>
          <Link to="/projects/propose" className="text-white/75 hover:text-white">
            Propose a project
          </Link>
          <Link to="/projects/monitoring" className="text-white/75 hover:text-white">
            Follow the money
          </Link>
          <Link to="/participate?tab=feedback" className="text-white/75 hover:text-white">
            Give feedback
          </Link>
        </nav>

        <div className="flex flex-col gap-2">
          <p className="mb-1 font-semibold">Contact the county</p>
          {county ? (
            <>
              <a href={`tel:${county.contact.phone.replace(/\s/g, "")}`} className="text-white/75 hover:text-white">
                {county.contact.phone}
              </a>
              <a href={`mailto:${county.contact.email}`} className="text-white/75 hover:text-white">
                {county.contact.email}
              </a>
              <p className="text-white/75">{county.contact.hours}</p>
            </>
          ) : (
            <Link to="/contact" className="text-white/75 hover:text-white">
              Contact details
            </Link>
          )}
        </div>
      </div>

      <p className="mx-auto max-w-6xl border-t border-white/15 px-4 py-5 text-sm text-white/60 md:px-6">
        A practice project for frontend lessons. Sisi County and all its data are made up.
      </p>
    </footer>
  );
};

export default Footer;
