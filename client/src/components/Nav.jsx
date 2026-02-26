import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-chosen-blue text-full-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-10 py-5">
        <Link to="/">
          <img src="/dorc-typeface.png" alt="Dorc Logo" width={120} height={50} className="hover:opacity-70"/>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          <li><Link className="hover:text-blue-300" to="/guild">Guild</Link></li>
          <li><Link className="hover:text-blue-300" to="/leaderboard">Leaderboard</Link></li>
          <li><Link className="hover:text-blue-300" to="/profile">Profile</Link></li>
        </ul>

        <button
          className="md:hidden p-3 text-xl hover:text-blue-300"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
            <FiMenu />
        </button>
      </nav>

      {open && (
        <ul className="md:hidden bg-chosen-blue text-full-white items-center gap-4 py-5 px-5 border-t border-full-white/10">
          <li className="py-3 hover:text-blue-300">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          </li>
          <li className="py-3 hover:text-blue-300">
            <Link to="/guild" onClick={() => setOpen(false)}>Guild</Link>
          </li>
          <li className="py-3 hover:text-blue-300">
            <Link className="" to="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</Link>
          </li>
          <li className="py-3 hover:text-blue-300">
            <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          </li>
        </ul>
      )}
    </header>
  );
}