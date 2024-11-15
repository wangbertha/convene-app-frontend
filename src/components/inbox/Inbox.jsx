import { useEffect, useState } from "react";
import { useGetMeQuery } from "../../services/userSlice";
import { useGetUserChatsQuery } from "../../services/chatSlice";
import PotentialChats from "./PotentialChats";
import ChatCard from "./ChatCard";
import ChatMessages from "./ChatMessages";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import "../../styles/Inbox.css";

export default function Inbox() {
  const [socket, setSocket] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 499);

  const { data: initialChats } = useGetUserChatsQuery();
  const { data: user } = useGetMeQuery();
  const [chats, setChats] = useState([]);

  // Update `isMobileView` based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 499);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const newSocket = io("http://localhost:3000", { withCredentials: true });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <div className="inboxMain">
      {!isMobileView && (
        <>
          <aside className="conversations">
            <PotentialChats user={user} chats={chats} />
            <h3 className="convos">Conversations</h3>
            {chats?.map((chat) => (
              <ChatCard
                key={chat.id}
                user={user}
                chat={chat}
                onDeleteChat={handleDeleteChat}
                setIsChatOpen={setIsChatOpen}
              />
            ))}
          </aside>
          <ChatMessages user={user} socket={socket} />
        </>
      )}

      {isMobileView && isChatOpen && (
        <>
          <ChatMessages
            user={user}
            socket={socket}
            isMobileView={isMobileView}
            setIsChatOpen={setIsChatOpen}
          />
        </>
      )}

      {isMobileView && !isChatOpen && (
        <aside className="conversations-mobile">
          <PotentialChats user={user} chats={chats} />
          <h3 className="convos">Conversations</h3>
          {chats?.map((chat) => (
            <ChatCard
              key={chat.id}
              user={user}
              chat={chat}
              onDeleteChat={handleDeleteChat}
              setIsChatOpen={setIsChatOpen}
            />
          ))}
        </aside>
      )}
    </div>
  );
}
