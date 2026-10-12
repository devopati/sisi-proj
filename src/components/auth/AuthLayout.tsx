type AuthLayoutProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // links shown under the card
};

const AuthLayout = ({ title, intro, children, footer }: AuthLayoutProps) => {
  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="type-display text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-muted">{intro}</p>}
      <div className="mt-8 rounded-xl border border-line bg-white p-6">{children}</div>
      {footer && <div className="mt-6 flex flex-col gap-2 text-center text-sm">{footer}</div>}
    </div>
  );
};

export default AuthLayout;
