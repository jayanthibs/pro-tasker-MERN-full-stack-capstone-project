import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
function Navbar() {
  const { user, logout } = useUser();
  console.log("Navbar user:", user);

  return (
    <nav>
      {user?.firstName && (
        <li>
          Welcome {user.firstName} {user.lastName}!
        </li>
      )}
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li onClick={logout}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
