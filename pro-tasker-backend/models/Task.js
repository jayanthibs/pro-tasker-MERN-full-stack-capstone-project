import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // assignedTo: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;


