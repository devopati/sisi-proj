type PageHeaderProps = {
  title: string;
  intro?: string;
  children?: React.ReactNode; // buttons shown next to the title
};

const PageHeader = ({ title, intro, children }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="type-display text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </header>
  );
};

export default PageHeader;
