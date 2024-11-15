import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/Root";
import ActivityList from "./components/activities/ActivityList";
import Activity from "./components/activities/Activity";
import Home from "./components/home/Home";
import Auth from "./components/auth/Auth";
import Inbox from "./components/inbox/Inbox";
import Profile from "./components/users/Profile";
import BrowseProfiles from "./components/users/BrowseProfiles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/inbox", element: <Inbox /> },
      { path: "/login", element: <Auth /> },
      { path: "/register", element: <Auth /> },
      { path: "/activities", element: <ActivityList /> },
      { path: "/activities/:id", element: <Activity /> },
      { path: "/profile", element: <Profile /> },
      
      { path: "/browse", element: <BrowseProfiles /> },
    ],
  },
]);

export default router;
