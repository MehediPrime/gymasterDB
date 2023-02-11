const express = require("express");
const router = express.Router();
const Users = require("../schema/userSchema");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password.toString(), salt);
  return hash;
};
const checkPassword = (password, hash) => {
  return bcrypt.compareSync(password.toString(), hash.toString());
};

//Generate a random token
const generateToken = () => {
  return Math.random().toString(36).substr(2); // remove `0.`
};

router.get("/", (req, res) => {
  res.send("Welcome to GYMASTER");
});

//Post User Verification
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!checkPassword(req.body.password, user.password)) {
      res.status(401).json("Wrong password");
    } else {
    }
    const token = generateToken();
    const userUpdate = await Users.updateOne(
      { email: req.body.email },
      { token: token }
    );
    const responseData = {
      fname: user.fname,
      lname: user.lname,
      role: user.role,
      token: token,
    };
    res.status(200).json(responseData);
  } catch (err) {
    res.status(401).json("Email not registered");
  }
});

//Post User Registration
router.post("/registration", async (req, res) => {
  const password = encryptPassword(req.body.password);
  const user = new Users({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: password,
    role: "user",
    token: generateToken(),
  });
  try {
    const userNew = await user.save();
    res.status(201).json(userNew);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Post All User List
router.post("/userList", async (req, res) => {
  try {
    const user = await Users.findOne({
      role: req.body.role,
      token: req.body.token,
    });

    if (user) {
      const allUser = await Users.find({ role: "user" });
      res.status(200).json(allUser);
    } else {
      res.status(401).json("Unauthorized user");
    }
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
