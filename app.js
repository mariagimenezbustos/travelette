const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());



app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);

module.exports = app;
