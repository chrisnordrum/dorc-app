import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-5">Sorry, this page doesn't exist yet.</p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center gap-2 text-blue-400 rounded-full hover:text-blue-900 hover:border-blue-900 hover:bg-blue-50 px-4 py-2 border border-blue-400 transition-colors duration-300"
      >
        <FiArrowLeft className="text-lg" /> Back to Home
      </Link>
    </main>
  );
}
