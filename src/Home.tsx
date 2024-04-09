import { Link } from "react-router-dom";
import "./index.css";

export default function Home() {
  return (
    <main className="heroSec">
      <div className="hero">
        <h1>Welcome!</h1>
        <p className="description">It's time to get a personalized playlist.</p>
        <Link className="playlistLink" to="/playlist">
          Generate Playlist
        </Link>
      </div>
    </main>
  );
}
