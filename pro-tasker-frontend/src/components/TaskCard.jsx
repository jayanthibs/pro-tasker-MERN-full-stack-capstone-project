import { useState } from "react";
import { taskClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";

function TaskCard({ task, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const date = new Date(task.createdAt);

  const { setLoading, setError } = useGlobalState();

  // Update task
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskClient.put(`/${task._id}`, {
        title,
        description,
        status,
      });

      setTasks((prev) => prev.map((t) => (t._id === task._id ? data : t)));
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError(null);
    try {
      await taskClient.delete(`/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Title:{task.title}</h3>
      <p>Description:{task.description}</p>
      <div>Status: {task.status}</div>
      <div>
        Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </div>
      <h4>Project: {task.project.name}</h4>

      <button onClick={() => setIsModalOpen(true)}>Edit</button>
      <button onClick={handleDelete}>X</button>

      {isModalOpen && (
        <div>
          <h3>Edit Task</h3>

          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <div>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
