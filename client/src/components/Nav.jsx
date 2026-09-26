import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  RiHomeFill,
  RiCompass3Fill,
  RiTeamFill,
  RiTrophyFill,
  RiUserFill,
} from "react-icons/ri";

export default function Nav() {
  const { loggedIn, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-bg text-fg border-b-2 border-border">
        <nav className="mx-auto flex items-center px-6 sm:px-10 py-4 sm:py-5">
          <div className="flex-1 sm:hidden" />

          <Link to="/" className="flex justify-center sm:justify-start flex-1">
            <img
              src="/dorc-typeface.png"
              alt="Dorc Logo"
              className="w-24 md:w-32 hover:opacity-70 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-6 ml-auto">
            <li>
              <Link className="hover:text-accent transition-colors" to="/quest">
                Quests
              </Link>
            </li>

            <li>
              <Link className="hover:text-accent transition-colors" to="/guild">
                Guild
              </Link>
            </li>

            {/*  when logged in */}
            {loggedIn && (
              <>
                <li>
                  <Link
                    className="hover:text-accent transition-colors"
                    to="/leaderboard"
                  >
                    Leaderboard
                  </Link>
                </li>

                <li>
                  <Link
                    className="hover:text-accent transition-colors"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}

            {!loggedIn ? (
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-accent text-white hover:bg-primary transition"
                >
                  Get Started
                </Link>
              </li>
            ) : (
              <button
                className="p-2 bg-accent text-white text-sm rounded-full transition duration-200 hover:bg-primary"
                onClick={logout}
              >
                Sign Out
              </button>
            )}
          </ul>

          <div className="flex-1 sm:hidden" />
        </nav>
      </header>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-1 left-1 right-1 z-50 border-2 border-border bg-bg backdrop-blur-md rounded-full sm:hidden">
        <ul className="flex justify-around items-center py-2 text-fg">
          <li>
            <Link
              to="/"
              className="flex flex-col items-center gap-1 hover:text-accent"
            >
              <RiHomeFill size={20} />
              <span className="text-xs">Home</span>
            </Link>
          </li>

          <li>
            <Link
              to="/quest"
              className="flex flex-col items-center gap-1 hover:text-accent"
            >
              <RiCompass3Fill size={20} />
              <span className="text-xs">Quests</span>
            </Link>
          </li>

          <li>
            <Link
              to="/guild"
              className="flex flex-col items-center gap-1 hover:text-accent"
            >
              <RiTeamFill size={20} />
              <span className="text-xs">Guild</span>
            </Link>
          </li>

          {loggedIn && (
            <>
              <li>
                <Link
                  to="/leaderboard"
                  className="flex flex-col items-center gap-1 hover:text-accent"
                >
                  <RiTrophyFill size={20} />
                  <span className="text-xs">Ranks</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="flex flex-col items-center gap-1 hover:text-accent"
                >
                  <RiUserFill size={20} />
                  <span className="text-xs">Profile</span>
                </Link>
              </li>
            </>
          )}

          {!loggedIn && (
            <li>
              <Link
                to="/login"
                className="flex flex-col items-center gap-1 hover:text-accent"
              >
                <RiUserFill size={20} />
                <span className="text-xs">Login</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
