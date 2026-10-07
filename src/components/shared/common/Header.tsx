import { useContext } from "react";
import { ProductContext } from "../../../hooks/projectContext";

const Header = () => {
  const project = useContext(ProductContext);

  return (
    <header className="bg-green-900 flex justify-between items-center p-4">
      <p className="text">
        {project.name} / {project.price}
      </p>

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
