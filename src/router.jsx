import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./components/events/EventList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ path: "/Events", element: <EventsList /> }],
  },
]);

export default router;
