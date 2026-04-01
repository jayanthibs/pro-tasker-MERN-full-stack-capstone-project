import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import ProjectCard from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const { projectId } = useParams();
  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data: projectData } = await projectClient.get(`/${projectId}`);
        setProject(projectData);

        const { data: tasksData } = await projectClient.get(`/${projectId}/tasks`);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch project or tasks");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await projectClient.post(`/${projectId}/tasks`, { title, description, status });
      setTasks([data, ...tasks]);
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <ProjectCard project={project} variant="details" />
      <h1>Task List</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} setTasks={setTasks} />
      ))}
    </div>
  );
}

export default ProjectDetails;