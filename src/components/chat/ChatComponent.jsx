import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGetMeQuery } from "../users/userSlice";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  const { data: user, isLoading, error } = useGetMeQuery();

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", receivedMessage);

    return () => socket.off("receive_message", receivedMessage);
  }, []);

  const receivedMessage = (msg) => setMessages((state) => [...state, msg]);

  function joinRoom() {
    if (room.trim()) {
      socket.emit("join_room", room);
    }
  }

  // emits a message including room, message, timestamp, and sender
  function sendMessage(e) {
    e.preventDefault();
    if (message.trim() && room.trim() && user) {
      const msgData = {
        room,
        message,
        timestamp: new Date(),
        sender: { id: user.id, name: user.firstname },
      };
      socket.emit("send_message", msgData);
      setMessage("");
    }
  }

  console.log(messages);

  return (
    <div className="chat-container">
      <div className="room-input">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room number..."
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <span>
              <b>{msg.sender.id === user.id ? "Me" : msg.sender.name}: </b>
              {msg.message} {msg.timestamp.slice(11, 16)}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
