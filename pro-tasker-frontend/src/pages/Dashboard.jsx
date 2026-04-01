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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data } = await projectClient.get("/");
        setProjects(data);
        setError(null);
      } catch (err) {
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
      setProjects((prev) => [data, ...prev]);
      setName("");
      setDescription("");
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Project Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your projects efficiently
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-900 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-sm transition"
          >
            + New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Projects
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-2xl shadow-sm border">
              No projects found. Create your first project 🚀
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <ProjectCard
                    project={project}
                    setProjects={setProjects}
                    variant="dashboard"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5 animate-fadeIn">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Create Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Project Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter project description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
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

export default Dashboard;