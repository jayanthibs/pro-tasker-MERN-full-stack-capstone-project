import { taskClient } from "../clients/api.js";
import { Link } from "react-router-dom";

function TaskCard({ task, setTasks }) {
  const date = new Date(task.createdAt);

  // allow user to delete project
  const handleDelete = async () => {
    try {
      // removing project from database
      await taskClient.delete(`/${task._id}`);
      // removing project from state
      setTasks((tasks) => tasks.filter((t) => t._id !== task._id));
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
    }
  };

  return (
    <div>
      
        <h3>Title: {task.title}</h3>
        <p>Description: {task.description}</p>
        <div>
          Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
        <h4>
          Project: {task.project.name} 
        </h4>
      

      <button onClick={handleDelete}>X</button>
    </div>
  );
}

export default TaskCard;
