const { Router } = require("express");
const { AdminModel, CourseModel } = require("../db");
const { adminAuth } = require("../middleware/admin");
const { z } = require("zod");

const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../middleware/admin");
const bcrypt = require("bcrypt");
adminRouter.post("/signup", async (req, res) => {
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
    const data = await AdminModel.create({
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
adminRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string(),
  });
  const isSafe = requiredBody.safeParse(req.body);
  if (isSafe.success) {
    const { email, password } = req.body;

    const data = await AdminModel.findOne({
      email,
    });
    if (!data) {
      res.json({
        message: "user no exit in system",
      });
    }
    const matchPassword = await bcrypt.compare(password, data.password);

    if (matchPassword) {
      const token = jwt.sign({ id: data._id }, JWT_ADMIN_PASSWORD);
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
adminRouter.post("/course", adminAuth, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl } = req.body;
  const course = await CourseModel.create({
    title,
    description,
    price,
    imageUrl,
    adminId,
  });
  res.json({
    message: "course created",
    courseId: course._id,
  });
});
adminRouter.put("/course", adminAuth, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl, courseId } = req.body;
  const updatedCourse = await CourseModel.updateOne(
    { _id: courseId, adminId },
    { title, description, price, imageUrl }
  );
  res.json({
    message: "course updated",
    id: updatedCourse._id,
  });
});
adminRouter.get("/course/bulk", adminAuth, async (req, res) => {
  const adminId = req.userId;
  const bulkCourse = await CourseModel.find({ adminId });
  if (bulkCourse.length > 0) {
    res.json({
      bulkCourse,
    });
  }
});
module.exports = { adminRouter };
