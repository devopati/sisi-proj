import React from "react";
import DMore from "./DMore";

const DispChildren = (props: any) => {
  return (
    <div>
      {props.children}

      <DMore name={props.name} age={props.age} />

      <DMore name={"David"} age={34} />
    </div>
  );
};

export default DispChildren;
