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
const web3 = new Web3('https://mainnet.infura.io/hqRzEqFKv6IsjRxfVUWH');

console.log(web3.eth.defaultBlock);
web3.eth.getBlockNumber();
// web3.eth.getBlockNumber().then(console.log);
// change this to async await
web3.eth.getBlockNumber().then((latest) => {
  for (let i = 0; i < 10; i += 1) {
    //     web3.eth.getBlock(latest - i).then(console.log);
    web3.eth.getBlock('latest')
      .then((block) => {
        console.log('CL: block', block);
        // add foreach transactions
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
// web3.eth.getBlock('latest')
//   .then((block) => {
//     console.log('CL: block', block);
//     // add foreach transactions
//     web3.eth.getTransaction(block.transactions[0])
//       .then((transaction) => {
//         console.log('CL: block', transaction);
//         model.store(transaction, block.transactions[0]);
//       })
//       .catch((error) => {
//         console.log('CL: error', error);
//       });
//   })
//   .catch((error) => {
//     console.log('CL: error', error);
//   });

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

// function getBlock() {
//   web3.eth.getBlock().then(console.log).catch((error) => {
//     console.log('CL: error', error);
//     web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER_URI));
//     getBlock();
//   });
// }

module.exports = app;
