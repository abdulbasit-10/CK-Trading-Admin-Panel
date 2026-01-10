import { useEffect, useState } from "react";
import { socket } from "../socket";

const LiveSignals = () => {
  const [publicMessages, setPublicMessages] = useState([]);
  const [premiumSignals, setPremiumSignals] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 🔌 Connect on mount
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setConnected(false);
    });

    // 📢 Public messages
    socket.on("new_public_message", (data) => {
      setPublicMessages(prev => [...prev, data]);
    });

    // ⭐ Premium signals
    socket.on("new_premium_signal", (data) => {
      setPremiumSignals(prev => [...prev, data]);
    });

    // ❌ Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_public_message");
      socket.off("new_premium_signal");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Signals</h2>

      <p>
        Status:{" "}
        <strong style={{ color: connected ? "green" : "red" }}>
          {connected ? "Connected" : "Disconnected"}
        </strong>
      </p>

      <hr />

      <h3>📢 Public Chat</h3>
      {publicMessages.length === 0 && <p>No messages yet</p>}

      {publicMessages.map((msg, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <strong>{msg.sender}</strong>: {msg.text}
        </div>
      ))}

      <hr />

      <h3>⭐ Premium Signals</h3>
      {premiumSignals.length === 0 && <p>No signals yet</p>}

      {premiumSignals.map((signal, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          <p>{signal.message}</p>

          {signal.image_url && (
            <img
              src={signal.image_url}
              alt="signal"
              style={{ maxWidth: "100%", marginTop: 8 }}
            />
          )}

          {signal.video_url && (
            <video
              src={signal.video_url}
              controls
              style={{ maxWidth: "100%", marginTop: 8 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LiveSignals;
