const Loader = ({ label = "Loading" }: { label?: string }) => {
  return (
    <p role="status" className="flex items-center gap-3 py-12 text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-tea-light border-t-tea" aria-hidden />
      {label}...
    </p>
  );
};

export default Loader;
