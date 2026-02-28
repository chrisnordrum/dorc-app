import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ranks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => a.position - b.position);
          setRanks(sorted);
        } else {
          setRanks([]);
        }
      })
      .catch(() => {
        setError("Could not load leaderboard.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="mt-10 mb-6 text-center">Leaderboard</h1>

      {ranks.map((rank) => (
        <div key={rank.id} className="mb-4 text-center">
          {rank.position}. {rank.name} — Level {rank.level} — XP {rank.xp}
        </div>
      ))}
    </div>
  );
}