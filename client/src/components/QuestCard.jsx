const QuestCard = ({ quest }) => {
  return (
    <div
      className="flex flex-col justify-between rounded-xl p-5 border-2 shadow-md transition-transform duration-200 hover:-translate-y-0.5
                    bg-card text-card-fg border-border shadow-black/10"
    >
      <h2 className="text-xl font-bold mb-2 text-fg">{quest.title}</h2>

      <p className="mb-2 text-muted-fg font-light">{quest.description}</p>

      <div className="mt-2 w-fit px-3 py-1 rounded-full bg-accent text-fg">
        <p className="font-semibold">XP Reward: {quest.xpReward}</p>
      </div>
    </div>
  );
};

export default QuestCard;
