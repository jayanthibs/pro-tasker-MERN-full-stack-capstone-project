import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import ProjectCard from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchCard from "../components/SearchCard";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { projectId } = useParams();
  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data: projectData } = await projectClient.get(`/${projectId}`);
        setProject(projectData);

        const { data: tasksData } = await projectClient.get(
          `/${projectId}/tasks`,
        );
        setTasks(tasksData);

        setError(null);
      } catch (err) {
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
      const { data } = await projectClient.post(`/${projectId}/tasks`, {
        title,
        description,
        status,
      });

      setTasks((prev) => [data, ...prev]);

      setTitle("");
      setDescription("");
      setStatus("To Do");
      setIsModalOpen(false);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header + Project */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ProjectCard project={project} variant="details" />

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
            >
              + New Task
            </button>
          </div>
        </div>
        <SearchCard data={tasks} />

        {/* Tasks Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-4"
                >
                  <TaskCard task={task} setTasks={setTasks} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create New Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Task description"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
