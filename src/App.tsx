import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Layout from "./Layout";
import CreatedPlayList from "./components/CreatedPlaylist";
import PlaylistCreator from "./components/GeneratePlaylist";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/playlist" element={<PlaylistCreator />} />
          <Route path="/playlist/:playlistId" element={<CreatedPlayList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
