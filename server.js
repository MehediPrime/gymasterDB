require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database Connection Success"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GYMASTER Server");
});

const userRoute = require("./routes/users");
app.use("/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server Started on ${process.env.PORT}`);
});
