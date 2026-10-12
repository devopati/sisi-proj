import LinkButton from "../components/shared/ui/LinkButton";

const NotFound = () => {
  return (
    <div className="flex flex-col items-start gap-5">
      <h1 className="type-display text-5xl">Page not found</h1>
      <p className="text-lg text-muted">The link may be broken, or the page may have moved.</p>
      <div className="flex flex-wrap gap-3">
        <LinkButton to="/" title="Go to the home page" />
        <LinkButton to="/projects" title="Browse projects" variant="outline" />
      </div>
    </div>
  );
};

export default NotFound;
