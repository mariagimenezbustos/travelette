const express = require('express');
const router = express.Router();
const db = require("../model/helper");
var jwt = require("jsonwebtoken");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;

const supersecret = process.env.SUPER_SECRET;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const results = await db("SELECT * FROM users ORDER BY firstname ASC;");
    res.send(results.data);
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

/* GET users by id. */
// router.get('/:id', async function(req, res) {
//   const {id} = req.params;

//   try {
//     const results = await db(`SELECT * FROM users WHERE id = ${id};`);
//     res.send(results.data);
//   } catch (error) {
//     res.status(500).send({ err: err.message });
//   }
// });

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

/* POST user */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await db(
      `INSERT INTO users (username, password) VALUES ("${username}", "${hash}");`
    );

    res.send({ message: "Register successful" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

/* UPDATE password from user */
router.post("/register/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await db(
      `UPDATE users SET password = "${hash}" WHERE id = ${id};`
    );

    res.send({ message: "Register successful" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
