const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static("images"));
//DB connect
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rop9wxt.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database");
  });

//get all routes
const servicesRoute = require("./routes/service.route");
app.use("/services", servicesRoute);

app.get("/", (req, res) => {
  res.send("server is running.");
});
app.all("*", (req, res) => {
  res.send("Sorry! No route found.");
});
app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
