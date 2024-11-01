import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Event from "./components/events/Event";
import Auth from "./components/auth/Auth";
import Profile from "./components/users/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/login", element: <Auth /> },
      { path: "/Events", element: <EventsList /> },
      { path: "/register", element: <Auth /> },
      { path: "/events/:id", element: <Event /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

export default router;
