const express = require('express');
const router = express.Router();
const db = require("../model/helper");
var jwt = require("jsonwebtoken");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;
var userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');

const supersecret = process.env.SUPER_SECRET;

/* do login */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await db(
      `SELECT * FROM users WHERE username = "${username}";`
    );
    const user = results.data[0];
    if (user) {
      const user_id = user.id;

      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) throw new Error("Incorrect password");

      var token = jwt.sign({ user_id }, supersecret);
      res.send({ message: "Login successful, here is your token", token });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

/* register new user */
router.post("/register", async (req, res) => {
    const { firstname, lastname, username, password } = req.body;
  
    try {
      const hash = await bcrypt.hash(password, saltRounds);
  
      await db(
        `INSERT INTO users (firstname, lastname, username, password) VALUES ("${firstname}", "${lastname}", "${username}", "${hash}");`
      );
  
      res.send({ message: "Register successful" });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
});

/* GET profile of loggedin user */
router.get("/profile", userShouldBeLoggedIn, (req, res) => {
  res.send({
    message: "Here is the PROTECTED data for user " + req.user_id,
  });
});

module.exports = router;
