import { useState, useEffect } from "react";
import { taskClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

function TaskCard({ task, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "");

  const { setLoading, setError } = useGlobalState();

  const date = task?.createdAt ? new Date(task.createdAt) : null;

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "");
  }, [task]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await taskClient.put(`/${task._id}`, {
        title,
        description,
        status,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? data : t))
      );

      setIsModalOpen(false);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?"))
      return;

    setLoading(true);
    setError(null);

    try {
      await taskClient.delete(`/${task._id}`);

      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    setStatus(newStatus);

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, status: newStatus } : t
      )
    );

    try {
      const { data } = await taskClient.put(`/${task._id}`, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? data : t))
      );
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update status");
    }
  };

  if (!task) return null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between">
        
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {task.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">

          <div className="flex gap-2">
            <select
              value={status}
              onChange={handleStatusChange}
              className={`text-xs px-2 py-1 rounded-full border outline-none cursor-pointer ${getStatusColor(
                status
              )}`}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button onClick={() => setIsModalOpen(true)}>
              <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-800 transition" />
            </button>

            <button onClick={handleDelete}>
              <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-800 transition" />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {date
              ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
              : "-"}
          </div>

        </div>

        {/* Project name */}
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Project:</span>{" "}
          {task?.project?.name || "-"}
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-4">

            <h3 className="text-xl font-semibold">Edit Task</h3>

            <div>
              <label className="text-sm text-gray-600">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
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

export default TaskCard;