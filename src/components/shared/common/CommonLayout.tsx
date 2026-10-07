import React, { useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
