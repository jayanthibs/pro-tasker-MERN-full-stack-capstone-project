import { useState } from "react";
import { projectClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

function ProjectCard({ project, setProjects, variant = "dashboard" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  const { setLoading, setError } = useGlobalState();

  const date = project?.createdAt ? new Date(project.createdAt) : null;

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await projectClient.put(`/${project._id}`, {
        name,
        description,
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

  if (!project) return null;

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between">
        
        {/* Header */}
        <div className="mb-3">
          {variant === "dashboard" ? (
            <Link
              to={`/projectDetails/${project._id}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
            >
              {project.name}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">
              {project.name}
            </h3>
          )}

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          {variant === "dashboard" ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                
              >
                 <PencilIcon className="h-7 w-5 text-blue-500 hover:text-blue-800 transition"/>
              </button>

              <button
                onClick={handleDelete}
               
              >
                <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-800 transition"/>
              </button>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {date
                ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
                : "-"}
            </div>
          )}
        </div>

        {/* Owner (non-dashboard view) */}
        {variant !== "dashboard" && (
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Owner:</span>{" "}
            {project?.user?.firstName || "-"}{" "}
            {project?.user?.lastName || "-"}
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

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
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