import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Nav from "./components/Nav.jsx";
import Guild from "./pages/Guild";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/guild" element={<Guild />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
