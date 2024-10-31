import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/root";
import EventsList from "./pages/EventList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ path: "/Events", element: <EventsList /> }],
  },
]);

export default router;
