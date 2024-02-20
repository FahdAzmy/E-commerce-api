const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", (doc) => {
  satImageUrl(doc);
});
BrandSchema.post("save", (doc) => {
  satImageUrl(doc);
});
const brandModel = mongoose.model("Brands", BrandSchema);
module.exports = brandModel;
