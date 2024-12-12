const { Router } = require("express");
const { UserModel, PurchaseModel, CourseModel } = require("../db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/user");
const bcrypt = require("bcrypt");

const { JWT_USER_PASSWORD } = require("../middleware/user");

const userRouter = Router();
userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });
  const isSafe = requiredBody.safeParse(req.body);
  if (isSafe.success) {
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const data = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    if (data) {
      res.json({
        message: "user has been created you can now login in",
      });
    } else {
      res.json({
        message: "something went wrong in signup route",
      });
    }
  } else {
    res.json({
      isSafe,
    });
  }
});
userRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string(),
  });
  const isSafe = requiredBody.safeParse(req.body);
  if (isSafe.success) {
    const { email, password } = req.body;
    console.log(email);
    const data = await UserModel.findOne({
      email,
    });
    if (!data) {
      res.json({
        message: "user no exit in system",
      });
    }
    const matchPassword = await bcrypt.compare(password, data.password);

    if (matchPassword) {
      const token = jwt.sign({ id: data._id }, JWT_USER_PASSWORD);
      res.json({
        token,
      });
    } else {
      res.json({
        message: "incorrect credentials",
      });
    }
  } else {
    res.json({
      isSafe,
    });
  }
});

userRouter.get("/purchases", userAuth, async (req, res) => {
  const userId = req.userId;
  const bougthCourse = await PurchaseModel.find({ userId });
  const courseData = await CourseModel.find({
    _id: { $in: bougthCourse.map((b) => b.courseId) },
  });
  res.json({
    courseData,
  });
});

module.exports = {
  userRouter,
};
