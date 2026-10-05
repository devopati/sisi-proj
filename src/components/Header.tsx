import React from "react";

const Header = () => {
  return (
    <header className="bg-green-900 flex justify-between items-center p-4">
      <p className="text">SISI</p>

      <div>
        <ul className="flex gap-4 text-slate-50">
          <li>Home</li>
          <li>Projects</li>
          <li>About Us</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
