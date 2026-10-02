const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");
const s = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: [true, "Phone is required"], trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["business", "worker", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "approved",
    },
    skills: [String],
    experience: { type: String, default: "" },
    preferredRole: { type: String, default: "" },
  },
  { timestamps: true },
);
s.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});
s.methods.matchPassword = function (p) {
  return bcrypt.compare(p, this.password);
};
module.exports = mongoose.model("User", s);
