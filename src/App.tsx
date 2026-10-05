import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";
import DisplayProjects from "./components/DisplayProjects";
import DispChildren from "./components/DispChildren";

const projects = [
  { name: "Project 1", number: 1 },
  { name: "Project 2", number: 2 },
  { name: "Project 3", number: 3 },
];

const App = () => {
  const [all, setAll] = useState({
    name: "John",
    age: 30,
    count: 0,
  });

  const incCount = () => {
    setAll((prevState) => ({
      ...prevState,
      count: prevState.count + 1,
    }));
  };

  const changeName = (name: string) => {
    setAll((prevState) => ({
      ...prevState,
      name: name,
    }));
  };

  return (
    <>
      <Header />

      <div className="min-h-96 flex items-center justify-center flex-col gap-4">
        <p>{all.count}</p>
        <button className="bg-red-600 p-2" onClick={incCount}>
          Increment
        </button>
        <button className="bg-red-600 p-2" onClick={() => changeName("Alice")}>
          Change Name
        </button>
        <DispChildren name={all.name} age={all.age}>
          <h1 className="text-3xl font-bold text-center mt-8">
            Welcome to SISI
          </h1>

          <p className="text-center mt-4">
            SISI is a platform that showcases our projects and provides
          </p>

          <DisplayProjects title="Our Projects Title" projects={projects} />
        </DispChildren>

        <DispChildren>
          <p>mkjjgwefiuhewj kjiugwrhsekflnweofkhn</p>
        </DispChildren>
      </div>
      <Footer />
    </>
  );
};

export default App;
