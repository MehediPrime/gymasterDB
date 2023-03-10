require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connection Success"));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GYMASTER API World");
});

const userRoute = require("./routes/users");
app.use("/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server Started on ${process.env.PORT}`);
});
