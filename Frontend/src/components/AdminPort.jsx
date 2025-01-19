import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { apiConnector } from "../services/apiconnector";
import { endpoints } from "../services/apis";
import { Link } from "react-router-dom";

const AdminPort = () => {
  const [users, setUsers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const user = localStorage.getItem("user");
  const companyId = JSON.parse(user).companyId;
  const companyName = JSON.parse(user).companyName;

  const fetchUsers = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${endpoints.GET_EMPLOYEES_API}/${companyId}`
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, [companyId]);

  const toggleView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex justify-center items-center bg-[#1c1c1c]/80 min-h-screen">
      <div className="w-full max-w-4xl bg-zinc-900 rounded-lg p-6 m-6">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-semibold">
            Company {companyName} - Employee Activity Dashboard
          </h2>
          <p className="text-zinc-400 text-sm">
            Welcome to the Employee Activity Dashboard for Company {companyName}. Here,
            you can monitor the activities of each employee by selecting "View
            Activity" and tracking their performance for better workflow
            management.
          </p>
        </div>

        <div className="space-y-4">
          {users.slice(0, isExpanded ? users.length : 4).map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-zinc-600 rounded-full overflow-hidden">
                  <img
                    src={user?.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-zinc-400 text-sm">Employee</p>
                </div>
              </div>
              <Link to={`/dashboard/${user?._id}`}>
                <button className="flex items-center space-x-2 bg-indigo-700 text-zinc-100 py-3 px-4 rounded-xl hover:bg-indigo-600 font-medium">
                  <Eye className="w-4 h-4" />
                  <span>View Activity</span>
                </button>
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={toggleView}
          className="w-full mt-4 text-zinc-100 bg-indigo-700 py-2 rounded-xl hover:bg-indigo-600 transition-colors font-medium"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
};

export default AdminPort;
