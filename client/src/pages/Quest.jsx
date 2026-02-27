import React, { useState, useEffect } from "react";
import QuestCard from "../components/QuestCard";

const Quest = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/quests")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="p-6">
      <h1>All Quests</h1>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 mt-4">

        {data.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </main>
  );
};

export default Quest;