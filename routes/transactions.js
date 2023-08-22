const express = require('express');
const router = express.Router();
const db = require("../model/helper");
var userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');

//helper functions

//returns all the transactions in ascending order
const getAllTransaction = (req, res) => {
  db("SELECT transactions.*, categories.name FROM transactions LEFT JOIN categories ON transactions.category_id = categories.id ORDER BY date ASC;")
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
};

//returns a transaction based on the key you are serching for, eg /transactions/categories
const selectTransactionByKey = (req, res, key, value) => {
  db(`SELECT * FROM transactions WHERE ${key} = "${value}";`)
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err));
}

//CRUD

/* POST - Create a new transaction */
router.post("/", userShouldBeLoggedIn, async function(req, res) {
  const {date, category, merchant, description, amount, currency} = req.body;
  try {
    await db(`INSERT INTO transactions (date, category, merchant, description, amount, currency) 
    VALUES ('${date}', '${category}', '${merchant}', '${description}', '${amount}', '${currency}');`);
    getAllTransaction(req, res);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* GET All trasnsaction list. */
router.get('/', userShouldBeLoggedIn, function(req, res) {
  getAllTransaction(req, res);
});


/* GET transactions by id */
router.get('/:id', userShouldBeLoggedIn, (req, res) => {
  const key = "id";
  const value = req.params.id;
  selectTransactionByKey(req, res, key, value);
});

/* GET transactions by category name */
// router.get('/category/:value', (req, res) => {
//   const key = "category";
//   const value = req.params.value;
//   selectTransactionByKey(req, res, key, value);
// });
/* UPDATED THE DATABASE, SO THIS FUNCTION ALSO NEEDED AN UPDATE */
router.get('/category/:name', userShouldBeLoggedIn, async (req, res) => {
  const {name} = req.params;

  try {
    const categoryResults = await db(`SELECT * FROM categories WHERE name = "${name}";`);
    const transactionResults = await db(`SELECT * FROM transactions JOIN categories ON transactions.category_id = categories.id WHERE categories.name = "${name}"`);

    const category = categoryResults.data[0];
    const transaction = transactionResults.data;

    res.send({ category, transaction });
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

/* GET transactions by user firstname */
router.get('/user/:username', userShouldBeLoggedIn, async (req, res) => {
  const {username} = req.params;

  try {
    const userResults = await db(`SELECT * FROM users WHERE username = "${username}";`);
    const transactionResults = await db(`SELECT * FROM transactions JOIN users ON transactions.user_id = users.id WHERE users.username = "${username}";`);

    const user = userResults.data[0];
    const transaction = transactionResults.data;

    res.send({ user, transaction });
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

/* GET transactions by trip */
router.get('/trip/:id', userShouldBeLoggedIn, async (req, res) => {
  const {id} = req.params;

  try {
    const tripResults = await db(`SELECT * FROM users JOIN trip_user_relationship ON users.id = trip_user_relationship.user_id JOIN trips ON trips.id = trip_user_relationship.trip_id WHERE trips.id = ${id};`);
    const transactionResults = await db(`SELECT * FROM transactions JOIN trips ON transactions.trip_id = trips.id JOIN users ON transactions.user_id = users.id JOIN categories ON transactions.category_id = categories.id WHERE users.id = transactions.user_id AND trips.id = ${id} ORDER BY date ASC;`);
    // add also userResults and categoryResults

    const trip = tripResults.data;
    console.log("trip destination:", trip.destination);
    const transaction = transactionResults.data;
    console.log("transaction[0].destination:", transaction[0].destination);


    res.send({ trip, transaction });
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

/* GET transactions by currency */
router.get('/currency/:value', userShouldBeLoggedIn, (req, res) => {
  const key = "currency";
  const value = req.params.value;
  selectTransactionByKey(req, res, key, value);
});

// NOT FULLY WORKING, IT'S NOT UPDATING THE CURRENCY
// `UPDATE transactions SET amount = ${amount}, currency = "${currency}" WHERE id = ${id};`
// UPDATE transactions SET amount = 240, currency = "USD" WHERE id = 3;
/* PUT - Update category OR amount OR currency */

router.put('/:id', userShouldBeLoggedIn, async function(req, res) {
  const id = req.params.id;
  const { category, amount, currency } = req.body;
  try {
    if (category && amount && currency) {
      await db(`UPDATE transactions SET category = "${category}", amount = ${amount}, currency = "${currency}" WHERE id = ${id};`);
    } else if (amount && category) {
      await db(`UPDATE transactions SET category = "${category}", amount = ${amount} WHERE id = ${id};`);
    } else if (amount && currency) {
      await db(`UPDATE transactions SET amount = ${amount}, currency = "${currency}" WHERE id = ${id};`);
    } else if (amount) {
      await db(`UPDATE transactions SET amount = ${amount} WHERE id = ${id};`);
    } else if (category) {
      await db(`UPDATE transactions SET category = "${category}" WHERE id = ${id};`);
    } else if (currency) {
      await db(`UPDATE transactions SET currency = "${currency}" WHERE id = ${id};`);
    }
    const result = await db(`SELECT * FROM transactions WHERE id = ${id};`);
    res.send(result.data);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

router.delete('/:id', userShouldBeLoggedIn, async function(req, res) {
  const value = req.params.id;
  try {
    await db(`DELETE FROM transactions WHERE id=${value};`);
    getAllTransaction(req, res)
  } catch (error) {
    res.status(500).send({ err: err.message });
  }
});

module.exports = router;
