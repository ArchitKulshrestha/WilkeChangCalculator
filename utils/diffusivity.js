import mongoose from "mongoose";
const graphSchema = new mongoose.Schema(
  {
    diffusivity: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const graphs = mongoose.models.graphs || mongoose.model("graphs", graphSchema);
export default graphs;
