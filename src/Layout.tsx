import { Outlet } from "react-router-dom";
import NavBar from "./components/Nav";
import "./index.css";

const Layout = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
