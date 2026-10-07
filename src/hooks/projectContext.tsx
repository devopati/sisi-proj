import { createContext } from "react";
import { type ProductType } from "../types";

export const ProductContext = createContext<ProductType>({
  name: "",
  price: 0,
});

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const project = { name: "Project A", price: 100 };

  return (
    <ProductContext.Provider value={project}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProjectProvider;
