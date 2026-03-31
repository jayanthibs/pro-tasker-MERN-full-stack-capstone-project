import { projectClient } from "../clients/api.js";
import ProjectDetails from "../pages/ProjectDetails.jsx";
import { Link } from "react-router-dom";

function ProjectCard({ project, setProjects }) {
  const date = new Date(project.createdAt);

  // allow user to delete project
  const handleDelete = async () => {
    try {
      // removing project from database
      await projectClient.delete(`/${project._id}`);
      // removing project from state
      setProjects((projects) => projects.filter((p) => p._id !== project._id));
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
    }
  };

  return (
    <div>
      <Link to={`/ProjectDetails/${project._id}`}>
        <h3>Name: {project.name}</h3>
        <p>Description: {project.description}</p>
        <div>
          Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
        <h4>
          Owner: {project.user.firstName} {project.user.lastName}
        </h4>
      </Link>

      <button onClick={handleDelete}>X</button>
    </div>
  );
}

export default ProjectCard;
