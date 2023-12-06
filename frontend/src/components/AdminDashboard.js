import React, { useState } from "react";
import AdminFeed from "./AdminFeed";
import SettlementTable from "./SettlementTable";
import { downloadResults } from "../utils/download";

const callEndpoint = async (target, sessionState, extraPayload) => {
  const endpoint = process.env["REACT_APP_BACKEND_ENDPOINT"] + target;
  const data = {
    admin_pass: sessionState.admin_pass,
    session_id: sessionState.session_id,
    ...extraPayload,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(target, "called with success response.");
    } else {
      console.error("Server returned error:", await response.body);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

const PopupModal = ({ popupEnabled, onSettle }) => {
  const [settlementPrice, setSettlementPrice] = useState("");

  const handleSettleClick = () => {
    onSettle(settlementPrice);
  };

  if (!popupEnabled) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4 font-bold">Settle Market</h2>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="number"
          placeholder="Settlement Price"
          value={settlementPrice}
          onChange={(e) => setSettlementPrice(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSettleClick}
        >
          Settle
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ sessionState }) => {
  console.log(sessionState);
  const [popupEnabled, setPopupEnabled] = useState(false);

  const onSettle = (settlementPrice) => {
    setPopupEnabled(false);
    settleGame(settlementPrice);
  };

  const startGame = async () =>
    await callEndpoint("/start_market", sessionState);

  const pauseGame = async () =>
    await callEndpoint("/pause_market", sessionState);

  const settleGame = async (settlementPrice) =>
    await callEndpoint("/settle_market", sessionState, {
      settlement_price: Number(settlementPrice),
    });

  return (
    <div className="container mx-auto p-4">
      <PopupModal popupEnabled={popupEnabled} onSettle={onSettle} />
      <div className="text-4xl font-bold text-center mb-4">
        Game ID: {sessionState.session_id}
      </div>
      <div className="text-2xl font-bold text-left mb-4">
        Game Status:{" "}
        {sessionState.inplay
          ? "In-Play ✅"
          : sessionState.completed
          ? "Settled 📈"
          : "Paused 🛑"}
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className="flex-1 bg-green-500 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          onClick={startGame}
          disabled={sessionState.inplay || sessionState.completed}
        >
          Resume Game
        </button>
        <button
          className="flex-1 bg-yellow-500 hover:bg-yellow-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          onClick={pauseGame}
          disabled={!sessionState.inplay}
        >
          Pause Game
        </button>
        <button
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          onClick={() => popupEnabled || setPopupEnabled(true)}
          disabled={sessionState.completed}
        >
          Settle Game
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Session Details</h2>
        <div className="text-xl p-4 flex flex-row justify-between">
          <p>Title: {sessionState.title}</p>
          <p>Tick Size: {sessionState.tick_size}</p>
          <p>Unit: {sessionState.unit}</p>
        </div>
      </div>

      {sessionState.completed ? (
        <>
          <div className="flex flex-row justify-between mb-4">
            <div className="text-2xl font-semibold">Final Results</div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => downloadResults(sessionState)}
              >
                Download Results
              </button>
            </div>
          </div>

          <SettlementTable
            users={sessionState.users}
            final_positions={sessionState.final_positions}
          />
        </>
      ) : (
        <AdminFeed sessionState={sessionState} />
      )}

      {sessionState.isSettled && <FinalResults results={{}} />}
    </div>
  );
};

export default AdminDashboard;

const FinalResults = ({ results }) => {
  // Render final results
  return <div>{/* Render your final results here */}</div>;
};
