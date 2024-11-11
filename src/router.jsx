import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Auth from "./components/auth/Auth";
import Activity from "./components/events/Activity";
import Inbox from "./components/inbox/Inbox";
import Profile from "./components/users/Profile";
import Chat from "./components/chat/ChatComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/inbox", element: <Inbox /> },
      { path: "/login", element: <Auth /> },
      { path: "/register", element: <Auth /> },
      { path: "/events", element: <EventsList /> },
      { path: "/activities/:id", element: <Activity /> },
      { path: "/profile", element: <Profile /> },
      { path: "/chat", element: <Chat /> },
    ],
  },
]);

export default router;
