import React, { useState } from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

const AdminPort = () => {
  const users = [
    { id: 1, name: "Sarah Johnson", role: "Product Designer" },
    { id: 2, name: "Michael Chen", role: "Developer" },
    { id: 3, name: "Emma Williams", role: "Marketing Manager" },
    { id: 4, name: "James Lee", role: "UX Designer" },
    { id: 5, name: "Olivia Martin", role: "Frontend Developer" },
    { id: 6, name: "Liam Scott", role: "Backend Developer" },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex justify-center items-center bg-[#1c1c1c]/80 min-h-screen">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-lg p-6 m-6">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-semibold">
            Company XYZ - Employee Activity Dashboard
          </h2>
          <p className="text-zinc-400 text-sm">
            Welcome to the Employee Activity Dashboard for Company XYZ. Here,
            you can monitor the activities of each employee by selecting "View
            Activity" and tracking their performance for better workflow
            management.
          </p>
        </div>

        <div className="space-y-4">
          {users.slice(0, isExpanded ? users.length : 4).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden">
                  <img
                    src={`/api/placeholder/48/48`}
                    alt={`${user.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-zinc-400 text-sm">{user.role}</p>
                </div>
              </div>
              <button
                variant="outline"
                className="flex items-center space-x-2  bg-indigo-700 text-zinc-100 py-3 px-4 rounded-xl hover:bg-indigo-600 font-medium"
              >
                <Eye className="w-4 h-4" />
                <span>View Activity</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex">
          <button
            onClick={toggleView}
            className="mt-2 flex items-center justify-center py-3 px-2 text-gray-400 hover:text-white transition-colors border border-gray-400 hover:border-white rounded-lg"
          >
            <span className="mr-1">
              {" "}
              {isExpanded ? "Show Less" : "Show More"}
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPort;
