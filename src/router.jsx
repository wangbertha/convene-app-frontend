import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Auth from "./components/auth/Auth";
import Event from "./components/events/Event";
import Inbox from "./components/inbox/Inbox";
import Profile from "./components/users/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/inbox", element: <Inbox /> },
      { path: "/login", element: <Auth /> },
      { path: "/register", element: <Auth /> },
      { path: "/events", element: <EventsList /> },
      { path: "/events/:id", element: <Event /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

export default router;
