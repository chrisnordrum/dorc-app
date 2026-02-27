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
    <section>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6">
        {displayedQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </section>
  );
};

export default Quest;