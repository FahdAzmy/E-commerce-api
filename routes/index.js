const mountRoute = (app) => {
  app.use("/api/v1/categories", require("./catogryRoutes"));
  app.use("/api/v1/subcateogry", require("./subCategoryroute"));
  app.use("/api/v1/brands", require("./brandRoutes"));
  app.use("/api/v1/product", require("./productRoute"));
  app.use("/api/v1/user", require("./userRoute"));
  app.use("/api/v1/auth", require("./authRoute"));
  app.use("/api/v1/review", require("./reviewRoute"));
  app.use("/api/v1/wishlist", require("./wichListRoute"));
  app.use("/api/v1/address", require("./addressroute"));
  app.use("/api/v1/copon", require("./coponRoute"));
  app.use("/api/v1/cart", require("./cartRoute"));
  app.use("/api/v1/orders", require("./orderRoute"));
};
module.exports = mountRoute;
