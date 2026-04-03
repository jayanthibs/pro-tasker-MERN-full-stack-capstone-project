import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import ProjectCard from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchCard from "../components/SearchCard";
import useProgress from "../hooks/useProgress";
import ProgressCircle from "../components/ProgressCircle";
import TasksOverview from "../components/TasksOverview";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { projectId } = useParams();
  const { loading, setLoading, error, setError } = useGlobalState();

  const progress = useProgress(tasks);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data: projectData } = await projectClient.get(`/${projectId}`);
        setProject(projectData);

        const { data: tasksData } = await projectClient.get(
          `/${projectId}/tasks`
        );

        setTasks(tasksData);
        setFilteredTasks(tasksData);
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

      const updatedTasks = [data, ...tasks];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

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
      <div className="flex justify-center items-center h-screen px-4">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-200 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

        {/* Page Header */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-800 mb-2">
            {project?.name || "Project Dashboard"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Track tasks, monitor progress, and manage your project effectively.
          </p>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row items-center gap-6">

            {/* Project */}
            <div className="w-full lg:flex-[1.5]">
              <ProjectCard project={project} variant="details" />
            </div>

            {/* Progress */}
            <div className="w-full flex justify-center lg:flex-1">
              <ProgressCircle progress={progress} />
            </div>

            {/* Button */}
            <div className="w-full flex justify-center lg:justify-end lg:flex-1">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition cursor-pointer"
              >
                + New Task
              </button>
            </div>

          </div>
        </div>

        {/* Search */}
        <SearchCard
          data={tasks}
          onFilter={setFilteredTasks}
          setSearchQuery={setSearchQuery}
        />

        {/* Overview */}
        <TasksOverview tasks={tasks} />

        {/* Tasks Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            {searchQuery ? "Search Results" : "Tasks"}
          </h2>

          {searchQuery ? (
            filteredTasks.length === 0 ? (
              <p className="text-gray-500">No tasks found.</p>
            ) : (
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} setTasks={setTasks} />
                ))}
              </div>
            )
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available.</p>
          ) : (
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} setTasks={setTasks} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-5 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Create New Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg h-24 resize-none"
                  placeholder="Task description"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
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
                  className="px-4 py-2 rounded-lg bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white cursor-pointer"
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