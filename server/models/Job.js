const mongoose = require("mongoose");
const R = [true, "is required"];
module.exports = mongoose.model(
  "Job",
  new mongoose.Schema(
    {
      businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      title: { type: String, required: R, trim: true },
      storeName: { type: String, required: R, trim: true },
      location: { type: String, required: R, trim: true },
      staffType: {
        type: String,
        enum: ["sales_assistant", "cashier"],
        required: R,
      },
      workersRequired: { type: Number, required: R, min: 1 },
      date: { type: Date, required: R },
      startTime: { type: String, required: R },
      endTime: { type: String, required: R },
      payRate: { type: Number, required: R, min: 0 },
      requirements: { type: String, default: "" },
      status: {
        type: String,
        enum: ["open", "filled", "completed", "cancelled"],
        default: "open",
      },
    },
    { timestamps: true },
  ),
);
