function downloadResults(sessionState) {
  const results = {
    final_positions: sessionState.final_positions,
    users: sessionState.users,
    trades: sessionState.trades,
    settlement_price: sessionState.settlement_price,
  };

  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(results)], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = "results.json";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export { downloadResults };
