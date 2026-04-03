import { useState, useEffect } from "react";
import { projectClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
function ProjectCard({ project, setProjects, variant = "dashboard" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "");
  const { setLoading, setError } = useGlobalState();

  useEffect(() => {
    setName(project?.name || "");
    setDescription(project?.description || "");
    setStatus(project?.status || "");
  }, [project]);
  const date = project?.createdAt ? new Date(project.createdAt) : null;
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectClient.put(`/${project._id}`, {
        name,
        description,
        status,
      });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? data : p))
      );
      setIsModalOpen(false);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await projectClient.delete(`/${project._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setProjects((prev) =>
      prev.map((p) =>
        p._id === project._id ? { ...p, status: newStatus } : p
      )
    );

    try {
      const { data } = await projectClient.put(`/${project._id}`, {
        status: newStatus, 
      });
      // Sync with backend response
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? data : p))
      );
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update status");
    } 
  };
  if (!project) return null;
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between">

        
        {/* Header */}
        <div className="mb-3">
          {variant === "dashboard" ? (
            <Link
              to={`/projectDetails/${project._id}`}
              className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition"
            >
              {project.name}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">
              {project.name}
            </h3>
          )}
          <p className="text-sm text-gray-800 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between ">
          {variant === "dashboard" ? (
            <div className="flex gap-2">
              <select
                value={status}
                onChange={handleStatusChange}
                className={`text-xs px-2 py-1 rounded-full border outline-none cursor-pointer ${getStatusColor(
                  status
                )}`}
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button onClick={() => setIsModalOpen(true)}>
                <PencilIcon className="h-7 w-5 text-blue-500 hover:text-blue-800 transition cursor-pointer" />
              </button>
              <button onClick={handleDelete}>
                <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-800 transition cursor-pointer" />
              </button>
            </div>
          ) : (
            <div className="mt-1 text-sm text-gray-800">
              <span className="font-bold">CreatedAt:</span>{" "}
              {date
                ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                : "-"}
            </div>
          )}
        </div>
        {/* Owner */}
        {variant !== "dashboard" && (
          <div className="mt-1 text-sm text-gray-800">
            <span className="font-bold">Owner:</span>{" "}
            {project?.user?.firstName || "-"} {project?.user?.lastName || "-"}
          </div>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Edit Project</h3>
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ProjectCard;