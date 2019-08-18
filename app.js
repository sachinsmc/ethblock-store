/* eslint-disable no-use-before-define */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Web3 = require('web3');

require('dotenv').config();

const indexRouter = require('./routes');
const Model = require('./models');

const model = new Model();

const app = express();
const web3 = new Web3(process.env.PROVIDER_URI);

console.log(web3.eth.defaultBlock);
web3.eth.getBlockNumber();
web3.eth.getBlockNumber().then((latest) => {
  // for (let i = 0; i < 10000; i += 1) {
  for (let i = 0; i < 10; i += 1) {
    web3.eth.getBlock(latest - i)
      .then((block) => {
        console.log('CL: block', block);
        block.transactions.forEach((datum) => {
          web3.eth.getTransaction(datum)
            .then((transaction) => {
              console.log('CL: transaction', transaction);
              model.store(transaction, datum);
            })
            .catch((error) => {
              console.log('CL: error', error);
            });
        });
      })
      .catch((error) => {
        console.log('CL: error', error);
      });
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
