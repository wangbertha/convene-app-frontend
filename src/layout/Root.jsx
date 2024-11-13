import { Outlet } from "react-router-dom";
import "../index.css"
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
