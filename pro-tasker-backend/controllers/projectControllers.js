import Project from "../models/Project.js";
import Task from "../models/Task.js";
//create project
export async function createProject(req, res) {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });
     await newProject.populate("user", 'firstName lastName');
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//get all projects
export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ user: req.user._id })
                                  .sort({ createdAt: -1 })
                                  .populate("user", 'firstName lastName');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//get single project
export async function getProject(req, res) {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with ${req.params.id} is not found` });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//update a project
export async function updateProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this project" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
   // res.status(201).json(updatedProject);
     res.status(201).json(`Updated project with name ${updatedProject.name},  ${updatedProject}`);
  } catch (error) {
    res.status(500).json(error);
  }
}

//delete a project
export async function deleteProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this project" });
    }

    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    const deletedTasks = await Task.deleteMany({ project: req.params.id });


   // res.status(200).json(deletedProject, deletedTasks);

    res.status(200).json(`Deleted project with name ${deletedProject.name} and deleted ${deletedTasks.deletedCount} tasks associated with the project`);

  } catch (error) {
    res.status(500).json(error);
  }
}
