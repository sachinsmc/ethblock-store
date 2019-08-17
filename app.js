/* eslint-disable no-use-before-define */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Web3 = require('web3');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('CONNECTED TO MONGO DB');
});

const Block = mongoose.model('block', {
  blockNumber: Number,
  from: String,
  to: String,
  transactionHash: String,
});

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER_URI));

web3.setProvider(new Web3.providers.WebsocketProvider(`ws://${process.env.PROVIDER_URI}`));

console.log(web3.eth.defaultBlock);
web3.eth.getBlockNumber().then(console.log);
web3.eth.getBlock('latest')
  .then((block) => {
    console.log('CL: block', block);
    web3.eth.getTransaction(block.transactions[0])
      .then((transaction) => {
        console.log('CL: block', transaction);
        const newBlock = new Block({
          blockNumber: 3 || transaction.number,
          from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b' || transaction.from,
          to: '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f' || transaction.to,
          transactionHash: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b§234' || block.transactions[0],
        });
        newBlock.save().then(() => console.log('Saved data in DB'));
      })
      .catch((error) => {
        console.log('CL: error', error);
      });
  })
  .catch((error) => {
    console.log('CL: error', error);
  });
// web3.eth.getBlock(3150).then(console.log);

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
