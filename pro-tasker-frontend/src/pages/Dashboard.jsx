import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useGlobalState } from "../context/GlobalStateContext";
import StatsCard from "../components/StatsCard";
import SearchCard from "../components/SearchCard";
function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
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
      const { data } = await projectClient.post("/", {
        name,
        description,
        status,
      });
      setProjects((prev) => [data, ...prev]);
      setName("");
      setDescription("");
      setStatus("Pending");
      setIsModalOpen(false);
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
    <div className="min-h-screen bg-indigo-200 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">
              Project Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your projects efficiently
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl cursor-pointer"
          >
            + New Project
          </button>
        </div>
        {/* Search */}
        <div >
          <SearchCard
            data={projects}
            onFilter={setFilteredProjects}
            setSearchQuery={setSearchQuery}
          />
        </div>
        {/* Stats (hide during search) */}
        {!searchQuery && (
          <div className="bg-white/70 p-4 rounded-2xl shadow">
            <StatsCard projects={projects} />
          </div>
        )}
        {/* Projects */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-indigo-900">
            {searchQuery ? "Search Results" : "My Projects"}
          </h2>
          {searchQuery ? (
            filteredProjects.length === 0 ? (
              <p className="text-gray-500">No results found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    setProjects={setProjects}
                  />
                ))}
              </div>
            )
          ) : projects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  setProjects={setProjects}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Create Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Pending</option>
                <option>In-Progress</option>
                <option>Completed</option>
              </select>
              <div className="flex justify-end gap-2 ">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded cursor-pointer">
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