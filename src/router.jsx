import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Auth from "./components/auth/Auth";
import Event from "./components/events/Event";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/events", element: <EventsList /> },
      { path: "/register", element: <Auth /> },
      { path: "/events/:id", element: <Event /> },
    ],
  },
]);

export default router;
