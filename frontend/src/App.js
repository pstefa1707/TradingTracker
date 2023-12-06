import "./App.css";
import { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import JoinComponent from "./components/JoinComponent";
import PlayerDashboard from "./components/PlayerDashboard";
import socket from "./socket";
import { useEffect } from "react";

function App() {
  const [sessionState, setSessionState] = useState(null);
  console.log("re-render");

  useEffect(() => {
    socket.on("error", (data) => {
      console.log("error", data);
    });

    socket.on("state_update", (data) => {
      setSessionState({ ...sessionState, ...data });
    });

    return () => {
      socket.off("user_joined").off("error");
    };
  }, [sessionState]);

  return (
    <div className="App">
      <header className="App-header text-xl text-center p-2 mb-2 text-blue-500 bg-black">
        Trading Tracker
      </header>
      <div className="App-body">
        {sessionState ? (
          sessionState.admin ? (
            sessionState.users && <AdminDashboard sessionState={sessionState} />
          ) : (
            sessionState.users && (
              <PlayerDashboard sessionState={sessionState} />
            )
          )
        ) : (
          <JoinComponent setSessionState={setSessionState} />
        )}
      </div>
    </div>
  );
}

export default App;
