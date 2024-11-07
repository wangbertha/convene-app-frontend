//placeholder for inbox, more to come with socket-io code
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useGetMeQuery } from "../users/userSlice";

import "../../styles/Inbox.css";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default function Inbox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const conversationRef = useRef(null);

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
      scrollToBottom();
    }
  }

  // Scrolls the conversation to the bottom
  function scrollToBottom() {
    if (conversationRef.current) {
      setTimeout(() => {
        conversationRef.current.scrollTop =
          conversationRef.current.scrollHeight;
      }, 50);
    }
  }

  return (
    <>
      <h2 className="placeholder">
        This is a placeholder for our messaging app. Your inbox will go here.
      </h2>
      <div className="inboxMain">
        <aside className="conversations">
          <h3 className="convos">Conversations</h3>
          <div className="convoCard">
            <h4>John Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Bob Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Sarah Johnson</h4>
            <p>Click to view conversation</p>
          </div>
          <div className="convoCard">
            <h4>Joe Johnson</h4>
            <p>Click to view conversation</p>
          </div>
        </aside>
        <article className="conversation" ref={conversationRef}>
          <h3 className="convoWith">John Johnson</h3>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <span
                className={
                  msg.sender.id === user.id
                    ? "sent message"
                    : "recieved message"
                }
              >
                <b>{msg.sender.id === user.id ? "Me" : msg.sender.name}: </b>
                {msg.message} {msg.timestamp.slice(11, 16)}
              </span>
            </div>
          ))}
          <div className="chat-inputs">
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room number..."
            />
            <button onClick={joinRoom}>Join Room</button>
            <div className="compose">
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit" className="send">
                  Send
                </button>
              </form>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
