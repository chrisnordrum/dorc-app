import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Nav from "./components/Nav.jsx";
import Guild from "./pages/Guild";
import Leaderboard from "./pages/Leaderboard";
import Quest from "./pages/Quest.jsx";
import { useEffect } from "react";
import Profile from "./pages/Profile.jsx";

function App() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
    };

    apply(mq.matches);

    const handler = (e) => apply(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/guild" element={<Guild />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;