const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const app = express();
// Enable Other Domains to access  App
app.use(cors());
app.options("*", cors());
// Compression Respones
app.use(compression());
const morgan = require("morgan");
const apiError = require("./utils/apierror");
const dotenv = require("dotenv");
const globalError = require("./middleware/errorMidleware");
const dbConnection = require("./config/datebase");
const mountRoute = require("./routes/index");
dotenv.config({ path: "config.env" });
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
dbConnection();
mountRoute(app);
app.all("*", (req, res, next) => {
  // const err=new Error(`Can't Find This route${req.originalUrl}`)
  next(new apiError(`can't find this route:${req.originalUrl}`, 400));
});
app.use(globalError);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is runnig in port ${port}`);
});
//Event=> list => callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}|`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
