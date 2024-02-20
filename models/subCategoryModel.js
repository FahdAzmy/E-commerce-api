const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      unique: [true, "Subcategory is exist"],
      minlength: [3, "Too short "],
      mixlength: [32, "too long "],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    catogery: {
      type: mongoose.Schema.ObjectId,
      ref: "catogeries",
      require: [true, "Subcategory must be belong ot parent category "],
    },
  },
  { timestamps: true }
);
const subCatgoeryModel = mongoose.model("SubCategory", subCategorySchema);
module.exports = subCatgoeryModel;
