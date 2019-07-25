var express = require('express');
var jwt = require("jsonwebtoken");
var router = express.Router();

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  res.render('design', { title: 'Design' });
});
module.exports = router;
