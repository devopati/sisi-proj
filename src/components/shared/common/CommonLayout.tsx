import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

// Every page renders inside <Outlet />, between the header and the footer
const CommonLayout = () => {
  const { pathname } = useLocation();

  // Start each new page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;
