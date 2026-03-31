import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const { projectId } = useParams();

  useEffect(() => {
    async function getData() {
      try {

        
        //get our tasks from DB

        const { data } = await projectClient.get(`/${projectId}/tasks`);
        // console.log(response.data);

        //save that in the component's state
        setTasks(data);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //make a post request to create a project ( based off the state: name and description)

      const { data } = await projectClient.post(`/${projectId}/tasks`, {
        title,
        description,
        status,
      });
      console.log(data);

      //add the new project to our state
      setTasks([data, ...tasks]);

      //reset the form

      setTitle("");
      setDescription("");
      setStatus("To Do");
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <form onSubmit={handleSubmit}>
        <h2>Add a Task:</h2>

        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border"
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            type="text"
            id="description"
            required={true}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border"
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <button type="submit" className="border">
          Submit
        </button>
      </form>

      {/* key should be there in map and filter functions at the top level element*/}
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          setTasks={setTasks}
        />
      ))}
    </div>
  );
}

export default ProjectDetails;
