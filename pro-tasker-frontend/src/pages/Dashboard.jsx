import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import ProjectCard from '../components/ProjectCard'

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        //get our projects from DB

        
        const { data } = await projectClient.get("/");
        // console.log(response.data);

        //save that in the component's state
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //make a post request to create a project ( based off the state: name and description)

      const { data } = await projectClient.post("/", { name, description });
      console.log(data);

      //add the new project to our state
      setProjects([data, ...projects]);

      //reset the form

      setName("");
      setDescription("");
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Project Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <h2>Add a Project:</h2>

        <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
       
        <button type="submit" className="border">Submit</button>
      </form>

      {/* key should be there in map and filter functions at the top level element*/}
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} setProjects={setProjects} />
      ))}
    </div>
  );
}

export default Dashboard;
