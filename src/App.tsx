import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Layout from "./Layout";
import PlaylistCreator from "./components/GeneratePlaylist";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/api/auth/callback/spotify" element={<Home />} />
          <Route path="/playlist" element={<PlaylistCreator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
