import { useEffect, useState, useRef } from "react";
import { useGetMeQuery } from "../../services/userSlice";
import { useGetUserChatsQuery } from "../../services/chatSlice";
import PotentialChats from "./PotentialChats";
import ChatCard from "./ChatCard";
import ChatMessages from "./ChatMessages";

import { io } from "socket.io-client";

import "../../styles/Inbox.css";

export default function Inbox() {
  const [socket, setSocket] = useState(null);

  const {
    data: initialChats,
    isLoadingChats,
    chatsError,
  } = useGetUserChatsQuery();
  const { data: user, isLoadingUser, userError } = useGetMeQuery();
  const [chats, setChats] = useState([]);

  // Initialize local chats state when `initialChats` data is loaded
  useEffect(() => {
    if (initialChats) {
      setChats(initialChats);
    }
  }, [initialChats]);

  function handleDeleteChat(chatId) {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  }

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="inboxMain">
        <aside className="conversations">
          <PotentialChats user={user} chats={chats} />
          <h3 className="convos">Conversations</h3>
          {chats?.map((chat) => (
            <ChatCard
              key={chat.id}
              user={user}
              chat={chat}
              onDeleteChat={handleDeleteChat}
            />
          ))}
        </aside>
        <ChatMessages user={user} socket={socket} />
      </div>
    </>
  );
}
