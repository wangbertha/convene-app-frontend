import "../../styles/Inbox.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSendMessageMutation,
  useGetMessagesQuery,
  useGetConversationsQuery,
} from "./inboxApi";
import { setActiveConversation, addMessage } from "./inboxSlice";
import { useGetMeQuery } from "../users/userSlice";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Inbox() {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useGetMeQuery();
  const dispatch = useDispatch();
  const { activeConversation, conversations } = useSelector(
    (state) => state.inbox
  );
  const [message, setMessage] = useState("");
  const { data: messages } = useGetMessagesQuery(activeConversation?.id);
  const { data: allConversations } = useGetConversationsQuery(user?.id, {
    skip: !user,
  });
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (activeConversation) {
      socket.emit("join_conversation", activeConversation.id);

      socket.on("new_message", (newMessage) => {
        dispatch(addMessage(newMessage));
      });
    }

    return () => {
      socket.off("new_message");
    };
  }, [activeConversation, dispatch]);

  function ConversationSelectHandler(conversation) {
    dispatch(setActiveConversation(conversation));
  }

  async function SendMessageHandler() {
    if (message.trim() && activeConversation) {
      const newMessage = {
        senderId: userId,
        receiverId: activeConversation.userId,
        content: message,
      };
      await sendMessage(newMessage);
      socket.emit("send_message", newMessage);
      setMessage("");
    }
  }

  return (
    <div className="inboxMain">
      <aside className="conversations">
        <h3 className="convos">Conversations</h3>
        {allConversations?.map((conversation) => (
          <div
            key={conversation.id}
            className={`convoCard ${
              activeConversation?.id === conversation.id ? "active" : ""
            }`}
            onClick={() => ConversationSelectHandler(conversation)}
          >
            <h4>{conversation.userName}</h4>
            <p>Click to view conversation</p>
          </div>
        ))}
      </aside>

      <article className="conversation">
        <h3 className="convoWith">{activeConversation?.userName}</h3>
        {messages?.map((msg) => (
          <p
            key={msg.id}
            className={
              msg.senderId === userId ? "sent message" : "received message"
            }
          >
            {msg.content}
          </p>
        ))}
        <div className="compose">
          <input
            className="newMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type your message..."
          />
          <button className="send" onClick={SendMessageHandler}>
            Send
          </button>
        </div>
      </article>
    </div>
  );
}
