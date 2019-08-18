const express = require('express');
const Model = require('../models');

const model = new Model();

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/transactions/:id', async (req, res, next) => {
  console.log('CL: req.params.id', req.params.id);
  const userTransactions = await model.get(req.params.id);
  res.json(userTransactions);
});

module.exports = router;
