const express = require('express');
const router = express.Router();
const db = require("../model/helper");
var jwt = require("jsonwebtoken");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;
var userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');

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

/* GET own user */
router.get("/profile", userShouldBeLoggedIn, function (req, res, next) {
  res.send({
    message: "Here is the PROTECTED data for user " + req.username,
  });
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
