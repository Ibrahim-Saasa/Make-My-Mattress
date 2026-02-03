import React from "react";

const cards = [
  { title: "Advanced Foam", desc: "Cooling and contouring" },
  { title: "Sustainable", desc: "Eco-friendly materials" },
  { title: "Engineering", desc: "Zoned support" },
];

const WhyUsCards: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {cards.map((c) => (
      <div key={c.title} className="p-4 bg-white rounded shadow">
        <h3 className="font-bold">{c.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
      </div>
    ))}
  </div>
);

export default WhyUsCards;
