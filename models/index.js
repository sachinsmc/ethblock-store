/* eslint-disable class-methods-use-this */
// add db and store related code here
const mongoose = require('mongoose');

const Block = mongoose.model('block', {
  blockNumber: Number,
  from: String,
  to: String,
  transactionHash: String,
});

class Model {
  constructor() {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('CONNECTED TO MONGO DB');
    });
  }

  store(transaction, transactionHash) {
    // console.log('CL: Model -> store -> transaction, transactionHash', transaction, transactionHash);
    const newBlock = new Block({
      blockNumber: transaction.number || 3,
      from: transaction.from || '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      to: transaction.to || '0x6295ee1b4f6dd65047762f924ecd367c17eabf8f',
      transactionHash: transactionHash || '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b§234',
    });
    newBlock.save().then(() => console.log('Saved data in DB'));
  }

  get(from) {
    return new Promise((resolve, reject) => {
      Block.find({ from }, (err, docs) => {
        console.log('CL: Model -> get -> err, docs', err, docs);
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }
}

module.exports = Model;
