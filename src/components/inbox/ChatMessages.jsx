import { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useSendMessageMutation } from "../../services/messageSlice";
import { addMessage, setOnlineUsers } from "../../services/chatStateSlice";
import { useGetMeQuery } from "../../services/userSlice";

import moment from "moment";
import ImputEmoji from "react-input-emoji";

export default function ChatMessages({ socket, isMobileView, setIsChatOpen }) {
  const dispatch = useDispatch();
  const recipientUser = useSelector((state) => state.chats.recipientUser);
  const recipientId = recipientUser?.id;
  const selectedChat = useSelector((state) => state.chats.currentChat);
  const [messages, setMessages] = useState(selectedChat?.messages || []);
  const [textMessage, setTextMessage] = useState("");
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);

  const { data: user } = useGetMeQuery();
  const [sendMessage] = useSendMessageMutation();

  // Checks if the recipietn Id is in the online users array
  const isUserOnline = onlineUsers?.some(
    (user) => user?.userId === recipientId
  );

  useEffect(() => {
    if (!socket) return;

    // Emit user ID immediately after socket connection
    if (user?.id) socket.emit("addNewUser", user.id);

    // Listen for the updated online users list from the server
    //And stores them in state for online displaying
    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
      socket.off("getOnlineUsers");
    };
  }, [user, dispatch]);

  const messagesContainerRef = useRef(null);

  //Scrolls down
  function scrollDownChat() {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }

  // Scroll to bottom when messages update/change
  useEffect(() => {
    scrollDownChat();
  }, [messages]);

  // Gets the new message emited by the other user
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (selectedChat?.id === message.chatId) {
        dispatch(addMessage(message));
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("getMessage", handleNewMessage);

    return () => {
      socket.off("getMessage", handleNewMessage);
    };
  }, [socket, selectedChat, dispatch]);

  // Update messages when selected chat changes
  useEffect(() => {
    setMessages(selectedChat?.messages || []);
  }, [selectedChat]);

  // Handles sending a message
  async function handleSendMessage() {
    if (!textMessage.trim()) return;

    const newMessage = {
      text: textMessage,
      senderId: user.id,
      chatId: selectedChat.id,
    };

    try {
      const response = await sendMessage(newMessage);

      if (response.data) {
        const newMessage = response.data;
        dispatch(addMessage(newMessage));
        setMessages((prev) => [...prev, newMessage]);

        // Emit the message through socket
        socket?.emit("sendMessage", {
          ...newMessage,
          recipientId,
        });

        setTextMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // Sends the message when clicking enter, the imput emoji doesnt listen to submits
  // by default
  function onKeyEnter(e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  if (!recipientUser)
    return (
      <div className="chat-box">
        <div className="chat-header">Select a conversation</div>
        <div className="messages">Select a conversation</div>
      </div>
    );

  return (
    <div className={isMobileView ? "chat-box-mobile" : "chat-box"}>
      <div className="chat-header">
        {isMobileView && (
          <svg
            onClick={() => setIsChatOpen(false)}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="black"
            viewBox="0 0 16 16"
          >
            <path d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z" />
            <path d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
          </svg>
        )}
        {recipientUser.firstname}
        <span className={isUserOnline ? "user-online-chat-header" : ""}></span>
      </div>
      <div className="messages" ref={messagesContainerRef}>
        {selectedChat?.messages?.map((message, id) => (
          <div
            className={`${
              message?.senderId === user?.id
                ? "message self flex-grow-0"
                : "message  flex-grow-0"
            }`}
            key={id}
          >
            <span>{message.text}</span>
            <span className="message-footer">
              {moment(message.createdAt).calendar()}
            </span>
          </div>
        ))}
      </div>
      <div className="horizontal-input">
        <ImputEmoji
          value={textMessage}
          onChange={setTextMessage}
          onKeyDown={onKeyEnter}
          borderColor="rgba(72, 112. 223. 8.2)"
        />
        <button className="send-btn" onClick={() => handleSendMessage()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
