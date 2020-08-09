const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
var cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: "include",
  })
);
app.use(cookieParser());
app.use(express.json());

require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const userRouter = require("./routes/User");
const listRouter = require("./routes/List");
app.use("/user", userRouter);
app.use("/list", listRouter);

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log("express server started");
});
