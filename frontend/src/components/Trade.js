const Trade = ({ trade, username }) => {
  const bgColour = username
    ? trade.buyer === username
      ? "bg-green-100"
      : "bg-red-100"
    : "bg-gray-100";
  const borderColour = username
    ? trade.buyer === username
      ? "border-green-400"
      : "border-red-400"
    : "border-gray-400";

  return (
    <div
      className={`flex flex-col ${bgColour} border-l-8 ${borderColour} rounded shadow-md m-2 p-4 w-full`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-semibold">
          Buyer: <span className="text-gray-700">{trade.buyer}</span>
        </div>
        <div className="text-lg font-semibold">
          Seller: <span className="text-gray-700">{trade.seller}</span>
        </div>
        {/* </div>
      <div className="flex justify-between items-center"> */}
        <div className="text-lg font-semibold">
          Volume: <span className="text-gray-700">{trade.volume}</span>
        </div>
        <div className="text-lg font-semibold">
          Price: <span className="text-gray-700">{trade.price}</span>
        </div>
      </div>
    </div>
  );
};

export default Trade;
