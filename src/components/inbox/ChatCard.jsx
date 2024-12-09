import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useGetUserQuery } from "../../services/userSlice";
import { useDeleteChatMutation } from "../../services/chatSlice";
import {
  setCurrentChat,
  setRecipient,
  resetCurrentChat,
} from "../../services/chatStateSlice";

import moment from "moment";

import avatar from "/default-photo.jpg";

export default function ChatCard({ chat, user, onDeleteChat, setIsChatOpen }) {
  const dispatch = useDispatch();
  const newMessage = useSelector((state) => state.chats.newMessage);
  const [currentChat, setLocalChat] = useState(chat);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);
  const [deleteChat] = useDeleteChatMutation();

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
    setIsChatOpen(true);
  }

  function openOptions() {
    setIsOptionsOpen(!isOptionsOpen);
  }

  function openDeleteOption() {
    setIsOptionsOpen(setIsOptionsOpen(false));
    setIsDeleteOpen(!isDeleteOpen);
  }

  async function handleDeleteChat() {
    try {
      await deleteChat(chat.id).unwrap();
      onDeleteChat(chat.id);
      dispatch(resetCurrentChat());
      setIsOptionsOpen(false);
      if (currentChat.id === chat.id) setIsChatOpen(false);
    } catch (error) {
      console.error(`Failed to delete chat`, error);
    }
  }

  console.log();
  // Stores the last message from the chat to display in the chat card
  const lastMessage = currentChat?.messages?.[currentChat.messages.length - 1];

  if (isDeleteOpen)
    return (
      <div className="convoCard">
        <p>Delete this chat?</p>
        <button onClick={handleDeleteChat}>Yes</button>
        <button onClick={openDeleteOption}>No</button>
      </div>
    );
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
          {!isOptionsOpen ? (
            <div className="options-delete">
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  openOptions();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                // class="bi bi-three-dots"
                viewBox="0 0 16 16"
              >
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </div>
          ) : (
            <div className="options">
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteOption();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                // class="bi bi-trash-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
              </svg>
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  openOptions();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                // class="bi bi-x-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </div>
          )}
          <span className={isUserOnline ? "user-online-chat-card" : ""}></span>
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
