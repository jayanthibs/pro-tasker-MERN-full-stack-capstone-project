import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useGlobalState } from "../context/GlobalStateContext";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data } = await projectClient.get("/");
        setProjects(data);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await projectClient.post("/", { name, description });
      setProjects([data, ...projects]);
      setName("");
      setDescription("");
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>Project Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <h2>Add a Project:</h2>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>

      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} setProjects={setProjects} variant="dashboard" />
      ))}
    </div>
  );
}

export default Dashboard;