const { Router } = require("express");
const { CourseModel, PurchaseModel } = require("../db");
const { userAuth } = require("../middleware/user");

const courseRouter = Router();

courseRouter.post("/purchase", userAuth, async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;
  await PurchaseModel.create({
    courseId,
    userId,
  });
  res.json({
    message: "course bougth",
  });
});
courseRouter.get("/preview", async (req, res) => {
  const courses = await CourseModel.find({});
  res.json({
    courses,
  });
});

module.exports = { courseRouter };
