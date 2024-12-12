const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { z } = require("zod");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const JWT_SCRECT = "yoyoyodkdkdk";

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main() {
  await mongoose.connect(
    "mongodb+srv://admin:12345678910@cluster0.2mnf2.mongodb.net/course-selling-app"
  );
  app.listen(3000);
  console.log("listening to 3000");
}
main();
