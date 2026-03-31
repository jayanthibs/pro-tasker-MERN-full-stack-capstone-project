import Project from "../models/Project.js";
import Task from "../models/Task.js";
//create a task
export async function createTask(req, res){

try {
    const project = await Project.findOne({ _id: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id) {
      res
        .status(403)
        .json({ message: "User is not authorized to create a task" });
    }

    const newTask = await Task.create({
      ...req.body,
      project: req.params.projectId,
    });
    await newTask.populate('project', 'name');
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

}


// get all tasks
export async function getTasks(req, res){

    try {
        
        const tasks = await Task.find({
          //   user: req.user._id,
          project: req.params.projectId,
        })
        .sort({createdAt: -1})
        .populate("project");
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
}


//update a task
export async function updateTask(req, res){

    try {
    const task = await Task.findOne({ _id: req.params.taskId }).populate(
      "project",
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update the task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true },
    );

    //res.status(201).json(updatedTask);

     res.status(201).json(`Updated Task with name ${updatedTask.title}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
    
}

//delete a task
export async function deleteTask(req, res){

    try {
    const task = await Task.findOne({ _id: req.params.taskId }).populate(
      "project",
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete the task" });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

    //res.status(200).json(deletedTask);

      res.status(200).json(`Deleted task with name ${deletedTask.title}`);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
    
}
