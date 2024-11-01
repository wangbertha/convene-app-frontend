import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Event from "./components/events/Event";
import Inbox from "./components/inbox/Inbox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/Events", element: <EventsList /> },
      { path: "/events/:id", element: <Event /> },
      { path: "/inbox/", element: <Inbox /> },
    ],
  },
]);

export default router;
