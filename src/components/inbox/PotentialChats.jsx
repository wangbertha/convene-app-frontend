import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../../services/userSlice";
import { useCreateChatMutation } from "../../services/chatSlice";

export default function PotentialChats({ user, chats }) {
  const onlineUsers = useSelector((state) => state.chats.onlineUsers);
  const [potentialChats, setPotentialChats] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: users, isLoading, error } = useGetUsersQuery();

  const [createChat] = useCreateChatMutation();

  // Filters the users with whom you dont have a chat yet,
  // also takes the own user out of it
  useEffect(() => {
    if (!users || !user) return;

    const potChats = users?.filter((u) => {
      let doesChatExist = false;

      if (user.id === u.id) return false;

      if (chats)
        doesChatExist = chats?.some((chat) => {
          return chat.members[0] === u.id || chat.members[1] === u.id;
        });
      return !doesChatExist;
    });

    setPotentialChats(potChats);
  }, [chats, user, users]);

  // Toggles dropdown visibility
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // Handles chat creation
  function handleCreateChat(recipientId) {
    createChat({ firstId: user.id, secondId: recipientId });
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <div className="potential-chats-container">
      <button onClick={toggleDropdown} className="toggle-button">
        {isDropdownOpen ? "Close" : "Start a new conversation"}
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {potentialChats && potentialChats.length > 0 ? (
            potentialChats.map((u, index) => (
              <div
                className="single-pot-chat"
                key={index}
                onClick={() => handleCreateChat(u.id)}
              >
                {u.firstname}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?.id)
                      ? "user-online-chat-card"
                      : ""
                  }
                ></span>
              </div>
            ))
          ) : (
            <p>No new users available for chat.</p>
          )}
        </div>
      )}
    </div>
  );
}
