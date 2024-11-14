import { useGetUserQuery } from "../../services/userSlice";
import avatar from "/default-photo.jpg";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setRecipient } from "../../services/chatStateSlice";
import { useEffect, useState } from "react";

export default function ChatCard({ chat, user }) {
  const dispatch = useDispatch();
  const newMessage = useSelector((state) => state.chats.newMessage);
  const [currentChat, setLocalChat] = useState(chat);
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);

  const recipientId = chat?.members.find((id) => id !== user?.id);

  // Checks if the recipietn Id is in the online users array
  const isUserOnline = onlineUsers?.some(
    (user) => user?.userId === recipientId
  );

  const { data: recipientUser, isLoading: isLoadingRecipient } =
    useGetUserQuery(recipientId);

  // Update local chat when new message arrives
  useEffect(() => {
    if (newMessage && newMessage.chatId === chat.id) {
      setLocalChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage],
      }));
    }
  }, [newMessage, chat.id]);

  //Function to set current chat and recipient in state
  function handleSelectChat() {
    dispatch(setCurrentChat(currentChat));
    dispatch(setRecipient(recipientUser));
  }

  // Stores the last message from the chat to display in the chat card
  const lastMessage = currentChat?.messages?.[currentChat.messages.length - 1];

  return (
    <div className="convoCard" onClick={handleSelectChat} role="button">
      <div className="convoCard-top">
        <div className="chat-user-info">
          <img
            className="chat-pic"
            src={recipientUser?.profilePicture || avatar}
            alt=""
          />
          <h5>
            {recipientUser?.firstname} {recipientUser?.lastname}
          </h5>
        </div>
        <div className="chat-right-side">
          <span className={isUserOnline ? "user-online" : ""}></span>
          <p>
            {moment(chat.messages[chat.messages.length - 1]?.createdAt).isSame(
              new Date(),
              "day"
            )
              ? `Today ${moment(
                  chat.messages[chat.messages.length - 1]?.createdAt
                ).format("HH:mm")}`
              : moment(
                  chat.messages[chat.messages.length - 1]?.createdAt
                ).format("dddd HH:mm")}
          </p>
          <div className="notifications">2</div>
        </div>
      </div>

      <p className="chat_message">
        {lastMessage ? (
          lastMessage.text.length > 45 ? (
            `${lastMessage.text.slice(0, 35)}...`
          ) : (
            lastMessage.text
          )
        ) : (
          <b>Start the conversation!</b>
        )}
      </p>
    </div>
  );
}
