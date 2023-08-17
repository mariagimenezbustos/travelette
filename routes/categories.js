const express = require('express');
const router = express.Router();
const db = require("../model/helper");

/* GET categories listing. */
router.get('/', async function(req, res, next) {
  try {
    const results = await db("SELECT * FROM categories ORDER BY id ASC;");
    res.send(results.data);
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

/* GET categories by category name. */
router.get('/:name', async function(req, res) {
  const {name} = req.params;
  try {
    const results = await db(`SELECT * FROM categories WHERE name = "${name}";`);
    res.send(results.data);
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = router;
