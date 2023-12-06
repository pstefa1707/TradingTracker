import React, { useState, useEffect } from "react";

const UserSearch = ({ counterPartyName, setCounterPartyName, users }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (users.includes(counterPartyName)) setFilteredUsers([]);
    else if (counterPartyName) {
      const potentialUsers = users.filter((user) =>
        user.toLowerCase().includes(counterPartyName.toLowerCase())
      );
      setFilteredUsers(potentialUsers);
    } else {
      setFilteredUsers([]);
    }
  }, [counterPartyName, users]);

  return (
    <div className="relative">
      <input
        className="w-full mb-2 px-3 py-2 border rounded"
        type="text"
        placeholder="Counter Party Name"
        value={counterPartyName}
        onChange={(e) => setCounterPartyName(e.target.value)}
      />
      {filteredUsers.length > 0 && (
        <ul className="absolute w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setCounterPartyName(user)}
            >
              {user}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
