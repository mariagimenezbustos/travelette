const express = require('express');
const router = express.Router();
const db = require("../model/helper");

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
router.get('/:id', async function(req, res) {
  const {id} = req.params;

  try {
    const results = await db(`SELECT * FROM users WHERE id = ${id};`);
    res.send(results.data);
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = router;
