import { Link } from "react-router-dom";
import LogOutButton from "./Logout";
import Profile from "./Profile";

function NavBar() {
  return (
    <nav className="nav">
      <ul className="navItems">
        <li>
          <Link to="/api/auth/callback/spotify">Home</Link>
        </li>
        <Profile />
        <LogOutButton />
      </ul>
    </nav>
  );
}

export default NavBar;
