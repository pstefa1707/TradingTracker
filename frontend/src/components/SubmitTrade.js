import React, { useState } from "react";
import UserSearch from "./UserSearch";

const AdjustableContent = ({ adjustFunc, setFunc, value }) => {
  return (
    <>
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(-100)}
        >
          -100
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(-10)}
        >
          -10
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(-1)}
        >
          -1
        </button>
      </div>
      <div className="flex items-center mb-4">
        <input
          className="flex-1 border-gray-500 text-center"
          type="number"
          value={value}
          onChange={(e) => setFunc(Math.max(0, e.target.value))}
        />
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(100)}
        >
          +100
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(10)}
        >
          +10
        </button>

        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-20"
          onClick={() => adjustFunc(1)}
        >
          +1
        </button>
      </div>
    </>
  );
};

const SubmitTrade = ({ onSubmitTrade, sessionState }) => {
  const [counterPartyName, setCounterPartyName] = useState("");
  const [volume, setVolume] = useState(1);
  const [price, setPrice] = useState(0);
  const [tradeType, setTradeType] = useState("");

  console.log(sessionState);

  const username = sessionState.username;
  const session_id = sessionState.session_id;
  const users = Object.keys(sessionState.users);

  const adjustVolume = (amount) => {
    setVolume((prevVolume) => Math.max(1, prevVolume + amount));
  };

  const adjustPrice = (amount) => {
    setPrice((prevPrice) => Math.max(0, prevPrice + amount));
  };

  const submitTrade = () => {
    if (tradeType) {
      const trade_data = {
        buyer: tradeType === "buy" ? username : counterPartyName,
        seller: tradeType === "sell" ? username : counterPartyName,
        volume,
        price,
        session_id: session_id,
      };
      onSubmitTrade(trade_data);
      // Reset fields after submission
      setCounterPartyName("");
      setVolume(1);
      setPrice(0);
      setTradeType("");
    } else {
      alert("Please select Buy or Sell");
    }
  };

  return (
    <div className="mb-4 grid grid-cols-1 divide-y">
      {/* <input
        className="w-full mb-2 px-3 py-2 border rounded"
        type="text"
        placeholder="Counter Party Name"
        value={counterPartyName}
        onChange={(e) => setCounterPartyName(e.target.value)}
      /> */}
      <UserSearch
        setCounterPartyName={setCounterPartyName}
        counterPartyName={counterPartyName}
        users={users.filter((user) => user !== username)}
      />
      <div>
        <div className="font-bold mb-2 text-center">Volume</div>
        <AdjustableContent
          adjustFunc={adjustVolume}
          setFunc={setVolume}
          value={volume}
        />
      </div>
      <div>
        <div className="font-bold mb-2 text-center">Price</div>
        <AdjustableContent
          adjustFunc={adjustPrice}
          setFunc={setPrice}
          value={price}
        />
      </div>
      <div>
        <div className="font-bold mb-2 text-center">Direction</div>
        <div className="flex justify-center space-x-2 mb-4">
          <button
            className={`flex-1 font-bold py-2 px-4 rounded ${
              tradeType === "buy"
                ? "bg-blue-500 hover:bg-blue-700 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
            onClick={() => setTradeType("buy")}
          >
            Buy
          </button>
          <button
            className={`flex-1 font-bold py-2 px-4 rounded ${
              tradeType === "sell"
                ? "bg-red-500 hover:bg-red-700 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
            onClick={() => setTradeType("sell")}
          >
            Sell
          </button>
        </div>
        <button
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          onClick={submitTrade}
          disabled={sessionState.inplay === false}
        >
          {sessionState.inplay ? "Submit Trade" : "Game not in play."}
        </button>
      </div>
    </div>
  );
};

export default SubmitTrade;
