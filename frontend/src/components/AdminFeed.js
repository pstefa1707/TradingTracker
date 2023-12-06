import Trade from "./Trade";

const AdminFeed = ({ sessionState }) => {
  return (
    <div className="flex flex-row space-x-4 mb-4">
      <div className="mb-4 w-full">
        <h2 className="text-2xl font-semibold">
          Users ({Object.keys(sessionState.users).length})
        </h2>
        <ul className="text-xl p-4">
          {Object.keys(sessionState.users).map((username) => (
            <li className="mb-4" key={username}>
              - {username}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 w-full">
        <h2 className="text-2xl font-semibold">
          Trade-Feed ({sessionState.trades.length})
        </h2>
        <ul>
          {sessionState.trades.toReversed().map((trade) => (
            <li key={trade.timestamp}>
              <Trade trade={trade} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminFeed;
