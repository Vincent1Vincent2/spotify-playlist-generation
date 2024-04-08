import { Outlet } from "react-router-dom";
import PlaylistCreator from "./components/GeneratePlaylist";

const Layout = () => {
  return (
    <main>
      <header>
        <PlaylistCreator />
      </header>
      <Outlet />
    </main>
  );
};

export default Layout;
