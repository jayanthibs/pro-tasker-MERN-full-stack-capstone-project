import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import { useUser } from "./context/UserContext";
import { Navigate } from "react-router-dom";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  //bring in user info
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <Navbar />

      {user ? (
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projectDetails/:projectId" element={<ProjectDetails />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
