import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "../assets/protasker-logo2.png";

function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav className="bg-violet-300">

      <div className="flex items-center justify-between px-30 py-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="ProTasker Logo"
            className="h-14 w-auto object-contain scale-250"
          />
        </Link>

        {/* Right Section */}
        

          {/* Welcome */}
          {user?.firstName && (
            <span className="text-lg px-3 py-1 rounded-lg bg-gray-100 text-black border border-gray-200">
              Welcome{" "}
              <span className="font-semibold text-lg text-red-700">
                {user.firstName} {user.lastName}
              </span>
            </span>
          )}

          {/* Navigation */}
          <ul className="flex items-center gap-2 text-sm font-medium text-gray-600">

            {user ? (
              <>
                {/* Dashboard moved to the right */}
                <li>
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-lg text-black text-lg hover:bg-gray-100 transition"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-lg hover:bg-indigo-700 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      
    </nav>
  );
}

export default Navbar;