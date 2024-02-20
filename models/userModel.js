const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchmema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
      minlength: [3, "Too short "],
      mixlength: [32, "too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
    },
    passwordchangedAt: Date,
    phone: String,
    profileImg: String,
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordVerfied: Boolean,
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Too short "],
      mixlength: [32, "too long"],
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        select: "title",
      },
    ],
    address: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alies: String,
        details: String,
        phone: String,
        city: String,
        postolCode: String,
      },
    ],
  },
  { timestamps: true }
);
userSchmema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("user", userSchmema);
module.exports = userModel;
