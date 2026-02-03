import React from "react";

const stub = [
  { id: 1, title: "How to pick a mattress", type: "blog" },
  { id: 2, title: "Foam vs Spring", type: "vlog" },
];

const BlogVlogList: React.FC = () => (
  <div className="space-y-3">
    {stub.map((s) => (
      <div
        key={s.id}
        className="p-4 bg-white rounded shadow flex items-center justify-between"
      >
        <div>
          <h4 className="font-bold">{s.title}</h4>
          <p className="text-sm text-gray-500">{s.type.toUpperCase()}</p>
        </div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          Read
        </button>
      </div>
    ))}
  </div>
);

export default BlogVlogList;
