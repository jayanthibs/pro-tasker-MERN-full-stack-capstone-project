import { useState } from "react";
import { projectClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { Link } from "react-router-dom";

function ProjectCard({ project, setProjects, variant = "dashboard" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  const { setLoading, setError } = useGlobalState();
  const date = project?.createdAt ? new Date(project.createdAt) : null;

  // Update project
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectClient.put(`/${project._id}`, { name, description });
      setProjects((prev) => prev.map((p) => (p._id === project._id ? data : p)));
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    setError(null);
    try {
      await projectClient.delete(`/${project._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <div className="project-card">
      {variant === "dashboard" ? (
        <>
          <Link to={`/projectDetails/${project._id}`}>
            <h3>{project.name}</h3>
          </Link>
          <p>{project.description}</p>
          <button onClick={() => setIsModalOpen(true)}>Edit</button>
          <button onClick={handleDelete}>X</button>

          {isModalOpen && (
            <div className="modal">
              <h3>Edit Project</h3>
              <label>Name:</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Description:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              <div>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div>
            Created at: {date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "-"}
          </div>
          <h4>
            Owner: {project?.user?.firstName || "-"} {project?.user?.lastName || "-"}
          </h4>
        </>
      )}
    </div>
  );
}

export default ProjectCard;