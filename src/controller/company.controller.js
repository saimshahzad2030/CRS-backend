const User = require("../model/user.model");
const Job = require("../model/job.model");
const catchAsync = require("..//utils/catch-async");

const deleteCompany = catchAsync(async (req, res) => {
  const user = req?.user?.user?.role;
  const { id, email } = req.query;
  if (user === "admin") {
    if (!id || !email) {
      res.status(401).send("Enter Email");
    } else {
      const findUser = await User.findOne({ _id: id });
      if (!findUser) {
        res.status(401).send("No Company Found");
        return;
      }

      await User.deleteOne({ _id: id });
      await Job.deleteMany({ companyemail: email });
      res
        .status(200)
        .json({ message: `${findUser.email} Deleted Successfully` });
    }
  } else {
    res.status(520).json({ message: "You are not authorized" });
  }
});

const allCompanies = catchAsync(async (req, res) => {
  if (req?.user?.user?.role == "admin") {
    const { page } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "company" }).skip(skip).limit(limit);
    console.log(users);
    const totalPages = await User.countDocuments({ role: "company" });
    const pages = Math.ceil(totalPages / 10);
    res.status(200).json({ data: users, message: "Commpanies Fetched", pages });
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
});

module.exports = { deleteCompany, allCompanies };
