import { useState, useEffect } from "react";
import QuestCard from "../components/QuestCard";

const Quest = ({ limit }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/quests")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Error fetching quests:", err));
  }, []);

  // If limit exists, slice the array
  const displayedQuests = limit ? data.slice(0, limit) : data;

  return (
    <main className="p-6">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 mt-4">
        {displayedQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </main>
  );
};

export default Quest;