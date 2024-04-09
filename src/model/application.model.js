const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  companyname: { type: String, required: true },
  jobId: { type: String, required: true },
  studentId: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  availability: { type: String, required: true },
  appliedBy: { type: String, required: true },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("application", applicationSchema);
