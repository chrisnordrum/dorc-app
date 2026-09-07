import QuestGrid from "../components/QuestGrid";
import Modal from "../components/Modal";

const Quest = () => {
  return (
    <main>
      <h1 className="mb-6">All Quests</h1>
      <QuestGrid />
      <Modal isOpen={false} onClose={() => {}}>
        <h2>Quest Details</h2>
        <p>Here you can display the details of the selected quest.</p>
      </Modal>
    </main>
  );
};

export default Quest;