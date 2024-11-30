import { Outlet } from "react-router-dom";
import Navbar from "../layout/NavBar"
import Footer from "../layout/Footer"

function Root() {
  return (
    <div>
      <Navbar />
      <main className="root-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Root;
