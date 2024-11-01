import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Event from "./components/events/Event";
import Auth from "./components/auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/Events", element: <EventsList /> },
      { path: "/events/:id", element: <Event /> },
      { path: "/register", element: <Auth /> },
    ],
  },
]);

export default router;
