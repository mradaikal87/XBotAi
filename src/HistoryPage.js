import React, { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(saved);
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      <h2>Past Conversations</h2>
      {history.length === 0 && <div>No history yet</div>}
      {history.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
}

export default History;
