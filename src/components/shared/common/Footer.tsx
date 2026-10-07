import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-800 flex justify-between items-center p-4">
      <p>&copy; 2024 SISI. All rights reserved.</p>

      <div className="">
        <ul className="flex-col gap-4 text-slate-500">
          <li>
            <a href="#">Home</a>
          </li>
          <li>Projects</li>
          <li>About Us</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
