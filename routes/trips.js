const express = require('express');
const router = express.Router();
const db = require("../model/helper");
var userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');

/* GET trips listing. */
router.get('/', userShouldBeLoggedIn, async function(req, res, next) {
    try {
      const results = await db("SELECT * FROM trips ORDER BY id ASC;");
      res.send(results.data);
    } catch (error) {
      res.status(500).send({ err: err.message });
    }
});

/* GET trips by trip id. */
router.get('/:trip_id', userShouldBeLoggedIn, async function(req, res) {
    const {trip_id} = req.params;
    try {
      const results = await db(`SELECT * FROM trips WHERE id = ${trip_id};`);
      res.send(results.data);
    } catch (error) {
      res.status(500).send({ err: err.message });
    }
});

module.exports = router;