const mongoose = require("mongoose");
const id = (ref) => ({
  type: mongoose.Schema.Types.ObjectId,
  ref,
  required: true,
});
const s = new mongoose.Schema(
  {
    jobId: id("Job"),
    workerId: id("User"),
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
s.index({ jobId: 1, workerId: 1 }, { unique: true });
module.exports = mongoose.model("Application", s);
