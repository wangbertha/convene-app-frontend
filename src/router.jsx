import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";
import Auth from "./components/auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/Events", element: <EventsList /> },
      { path: "/register", element: <Auth /> },
    ],
  },
]);

export default router;
