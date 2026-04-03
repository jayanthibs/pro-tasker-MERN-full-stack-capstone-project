import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import Logo from "../assets/protasker-logo.png";

function NavBar() {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0f172a] border-b border-white/10 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="ProTasker Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Center Welcome (Desktop) */}
        {user?.firstName && (
          <div className="hidden md:flex bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 rounded-lg">
            <span className="text-lg px-4 py-1.5 rounded-lg bg-white/10 text-white border border-white/10">
              Welcome {" "}
              <span className="font-semibold text-white text-xl">
                {user.firstName} {user.lastName}
              </span>
            </span>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white hover:bg-indigo-700 transition text-lg"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg  text-red-500 bg-white hover:bg-red-500/30 transition cursor-pointer text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-white hover:bg-white/10 transition text-lg"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white text-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {user?.firstName && (
            <div className="text-center">
              <span className="block text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/10">
                Welcome {" "}
                <span className="font-semibold text-indigo-300">
                  {user.firstName} {user.lastName}
                </span>
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm font-medium">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-3 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-red-500/20 text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-3 py-2 rounded-lg text-white hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
