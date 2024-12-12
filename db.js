const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
mongoose.connect(
  "mongodb+srv://admin:12345678910@cluster0.2mnf2.mongodb.net/course-selling-app"
);
const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const Admin = new Schema({
  email: { type: String, unique: true },

  password: String,
  firstName: String,
  lastName: String,
});

const Course = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  adminId: ObjectId,
});

const Purchase = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const UserModel = mongoose.model("user", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("course", Course);
const PurchaseModel = mongoose.model("purchase", Purchase);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
};
