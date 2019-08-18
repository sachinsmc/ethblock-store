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
    const newBlock = new Block({
      blockNumber: transaction.number,
      from: transaction.from,
      to: transaction.to,
      transactionHash,
    });
    newBlock.save().then(() => console.log('Saved data in DB'));
  }

  get(from) {
    return new Promise((resolve, reject) => {
      Block.find({ from }, (err, docs) => {
        console.log('CL: Model -> get -> err, docs', err, docs);
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}

module.exports = Model;
