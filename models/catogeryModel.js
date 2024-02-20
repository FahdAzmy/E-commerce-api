const mongoose = require("mongoose");
const catogerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Catogery required"],
      unique: [true, "Catogery must be unique"],
      minlength: [3, "Too short "],
      mixlength: [32, "too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const satImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

catogerySchema.post("init", (doc) => {
  satImageUrl(doc);
});
catogerySchema.post("save", (doc) => {
  satImageUrl(doc);
});
const catogaryModel = mongoose.model("catogeries", catogerySchema);
module.exports = catogaryModel;
