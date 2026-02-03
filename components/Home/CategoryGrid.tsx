import React from "react";

const categories = ["Mattresses", "Pillows", "Bed Bases", "Accessories"];

const CategoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((c) => (
        <div key={c} className="p-4 bg-white rounded shadow text-center">
          {c}
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
