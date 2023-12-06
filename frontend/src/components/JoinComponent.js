import React, { useState } from "react";
import socket from "../socket"; // Import the socket instance

const JoinComponent = ({ setSessionState }) => {
  const [username, setUsername] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReconnect, setIsReconnect] = useState(false);

  const [adminPass, setAdminPass] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [unit, setUnit] = useState("");

  const socketId = socket.id;

  console.log(process.env["REACT_APP_BACKEND_ENDPOINT"]);

  const handleJoin = async () => {
    const endpoint =
      process.env["REACT_APP_BACKEND_ENDPOINT"] +
      (isAdmin ? "/join_as_admin" : "/join_as_player");
    const data = isAdmin
      ? {
          admin_pass: adminPass,
          session_title: gameTitle,
          unit,
          socket_id: socketId,
        }
      : {
          session_id: sessionID,
          username,
          socket_id: socketId,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        socket.emit("listen_to_room", { session_id: responseData.session_id });
        setSessionState({
          ...responseData,
          admin_pass: isAdmin && adminPass,
          username: !isAdmin && username,
        });
      } else {
        console.error("Join error:", responseData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleReconnect = async () => {
    const endpoint =
      process.env["REACT_APP_BACKEND_ENDPOINT"] +
      (isAdmin ? "/reconnect_as_admin" : "/reconnect_as_player");
    const data = {
      session_id: sessionID,
      admin_pass: isAdmin ? adminPass : undefined,
      socket_id: socketId,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        socket.emit("listen_to_room", { session_id: responseData.session_id });
        setSessionState(responseData);
      } else {
        console.error("Reconnect error:", responseData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg mb-4">Join Trading Game</h2>
        {isAdmin ? (
          isReconnect ? (
            <>
              <input
                className="w-full mb-2 px-3 py-2 border rounded"
                type="text"
                placeholder="Session ID"
                value={sessionID}
                onChange={(e) => setSessionID(e.target.value)}
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded"
                type="password"
                placeholder="Admin Password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                className="w-full mb-2 px-3 py-2 border rounded"
                type="text"
                placeholder="Game Title"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded"
                type="text"
                placeholder="Unit (e.g. USD, KM, KG, ...)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded"
                type="password"
                placeholder="Admin Password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
            </>
          )
        ) : (
          <>
            <input
              className="w-full mb-2 px-3 py-2 border rounded"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full mb-2 px-3 py-2 border rounded"
              type="text"
              placeholder="Session ID"
              value={sessionID}
              onChange={(e) => setSessionID(e.target.value)}
            />
          </>
        )}

        <div className="flex items-center mb-4">
          <input
            id="admin-checkbox"
            type="checkbox"
            className="mr-2"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="admin-checkbox">Administrator</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="reconnect-checkbox"
            type="checkbox"
            className="mr-2"
            checked={isReconnect}
            onChange={(e) => setIsReconnect(e.target.checked)}
          />
          <label htmlFor="reconnect-checkbox">Reconnection Request</label>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-2 w-full">
          {isReconnect ? (
            <button
              className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={isAdmin ? handleReconnect : handleJoin}
            >
              Reconnect
            </button>
          ) : (
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleJoin}
            >
              {isAdmin ? "Create" : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinComponent;
