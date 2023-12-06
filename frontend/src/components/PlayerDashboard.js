import React, { useState } from "react";
import TabSwitcher from "./TabSwitcher";
import SubmitTrade from "./SubmitTrade";
import Trade from "./Trade";

const PlayerDashboard = ({ sessionState }) => {
  const [currentTab, setCurrentTab] = useState("submit_trade");
  const tabHeaders = ["Submit Trade", "Trade Feed"];

  const onSubmitTrade = async (data) => {
    const endpoint =
      process.env["REACT_APP_BACKEND_ENDPOINT"] + "/submit_trade";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Trade successful.");
      } else {
        console.error("Server returned error:", await response.body);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="text-2xl font-bold text-center mb-4">
        Username: {sessionState.username}{" "}
      </div>
      <TabSwitcher
        tabHeaders={tabHeaders}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />

      {currentTab === "Submit Trade" ? (
        <SubmitTrade
          onSubmitTrade={onSubmitTrade}
          sessionState={sessionState}
        />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between bg-gray-100">
            <div className="text-2xl text-left font-bold pl-6 pt-2 mb-4">
              Total Trades: {sessionState.trades.length}
            </div>
            <div className="text-2xl text-left font-bold pr-6 pt-2 mb-4">
              Your Trades:{" "}
              {sessionState.users[sessionState.username].trades.length}
            </div>
          </div>
          <div className="flex flex-col items-center">
            {sessionState.users[sessionState.username].trades.map(
              (trade, i) => (
                <Trade key={i} trade={trade} username={sessionState.username} />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDashboard;
