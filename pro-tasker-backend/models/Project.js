import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Completed'],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // collaborators: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
});

// Compound unique index
projectSchema.index({ name: 1, user: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
