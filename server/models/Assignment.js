const mongoose = require("mongoose");
const id = (ref) => ({
  type: mongoose.Schema.Types.ObjectId,
  ref,
  required: true,
});
module.exports = mongoose.model(
  "Assignment",
  new mongoose.Schema(
    {
      jobId: id("Job"),
      workerId: id("User"),
      businessId: id("User"),
      status: {
        type: String,
        enum: ["assigned", "active", "completed", "cancelled"],
        default: "assigned",
      },
      assignedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
  ),
);
