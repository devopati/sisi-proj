import React from "react";

const DMore = ({ name, age }: { name: string; age: number }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mt-8">{name}</h2>
      <p className="text-center mt-4">{age}.</p>
    </div>
  );
};

export default DMore;
