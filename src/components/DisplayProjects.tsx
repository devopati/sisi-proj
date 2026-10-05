import React from "react";

interface Project {
  name: string;
  number: number;
}

type title = string;

interface DisplayProjectsProps {
  projects: Project[];
  title: title;
}

const DisplayProjects = (props: DisplayProjectsProps) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{props.title}</h1>
      {props.projects.map((project, index) => {
        return (
          <div key={index} className="bg-green-200 p-4 m-4 rounded-lg">
            <h2 className="text-lg font-bold">{project.name}</h2>
            <p>Project Number: {project.number}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayProjects;
