var express = require('express');
var router = express.Router();

var Ctrllers = require('./controllers')

/* GET home page. */


router.route('/')
  .get(function(req, res, next) {
    Ctrllers.main(req, res, next)
  });

module.exports = router;
