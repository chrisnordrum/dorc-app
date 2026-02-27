const QuestCard = ({ quest }) => {
  return (
    <div className="flex flex-col justify-between bg-full-white shadow-neutral-300 shadow-md rounded-xl p-5 border-2 border-chosen-blue hover:translate-y-[-2px] transition-transform duration-200">
      <h2 className="text-xl font-bold mb-2">{quest.title}</h2>
      <p className="text-chosen-blue-200 mb-2 font-light">{quest.description}</p>
      <div className="mt-2 bg-blue-300 w-fit px-3 py-1 rounded-full">
        <p className="font-semibold text-full-white">
          XP Reward: {quest.xpReward}
        </p>
      </div>
    </div>
  );
};

export default QuestCard;