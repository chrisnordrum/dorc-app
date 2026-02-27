import { useState, useEffect } from "react";
import QuestGrid from "../components/QuestGrid";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main>
        <h1 className="text-center mt-10 text-purple-400">Home</h1>
        <p className="text-center mt-5">Something went wrong: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-center text-dark-ocean">
        Do. Outplay. Rank. Conquer.
      </h1>

      <QuestGrid limit={3}/>
    </main>
  );
}