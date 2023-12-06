import React, { useState } from "react";

const SettlementTable = ({ users, final_positions }) => {
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedUsers = Object.keys(users).sort((a, b) => {
    if (sortKey === "username") {
      return sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    } else if (sortKey === "position" || sortKey === "pnl") {
      return sortDirection === "asc"
        ? final_positions[a][sortKey] - final_positions[b][sortKey]
        : final_positions[b][sortKey] - final_positions[a][sortKey];
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortKey(key);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col items-center">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("username")}
            >
              Username
            </th>
            <th
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("position")}
            >
              Position
            </th>
            <th
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort("pnl")}
            >
              PNL
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((username) => (
            <tr key={username}>
              <td className="border px-4 py-2">{username}</td>
              <td className="border px-4 py-2">
                {final_positions[username].position}
              </td>
              <td className="border px-4 py-2">
                {final_positions[username].pnl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SettlementTable;
