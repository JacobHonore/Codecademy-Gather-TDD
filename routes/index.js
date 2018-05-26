const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {newItem: newItem});
  }
  else {
    await newItem.save();
    res.redirect('/');
  }
});

router.get('/items/:id', async (req, res, next) => {
  Item.findById(req.params.id, function(err, singleItem) {
    if (!err && singleItem) {
      res.render('single-item', {item: singleItem});
    }
    else {
      res.status(404).send();
    }
  });
});
router.post('/items/:id/delete', async (req, res, next) => {
  Item.deleteOne({ _id: req.params.id}, function(err) {
    if (!err) {
      res.redirect('/');
    }
    else {
      res.status(404).send();
    }
  });
});
router.get('/items/:id/update', async (req, res, next) => {
  Item.findById(req.params.id, function(err, singleItem) {
    if (!err && singleItem) {
      res.render('update', {item: singleItem});
    }
    else {
      res.status(404).send();
    }
  });
});
router.post('/items/:id/update', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  Item.findByIdAndUpdate(req.params.id, {title, description, imageUrl}, function(err, item) {
    if (!err && item) {
      item.validateSync();
      if (item.errors) {
        res.status(400).render('update', {item: item});
      }
      else {
        item.save();
        res.redirect('/');
      }
    }
    else {
      console.log(err);
      res.status(404).send();
    }
  });
});
module.exports = router;
