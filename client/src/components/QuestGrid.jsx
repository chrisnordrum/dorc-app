import { useState, useEffect } from "react";
import QuestCard from "../components/QuestCard";

export default function QuestGrid({ limit }) {
  const [quests, setQuests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const res = await fetch("/api/quests");

        if (!res.ok) {
          throw new Error("Failed to fetch quests");
        }

        const result = await res.json();

        if (Array.isArray(result)) {
          setQuests(result);
        } else {
          setQuests([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuests();
  }, []);

  const displayedQuests = limit
    ? quests.slice(0, limit)
    : quests;

  if (loading) return <p>Loading quests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6">
      {displayedQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}