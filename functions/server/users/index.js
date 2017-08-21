var express = require('express');
var router = express.Router();

var Ctrllers = require('./controllers')


/* GET users listing. */
router.get('/', function(req, res, next) {
  Ctrllers['main'](req, res, next)
});

router.all('/:ctrl', function(req, res, next) {
  var ctrl = req.params.ctrl
  Ctrllers[ctrl](req, res, next)
});

router.all('/:ctrl/:token', function(req, res, next) {
  var ctrl = req.params.ctrl
  Ctrllers[ctrl](req, res, next)
});



  // /* MIDDLEWARE */

  



module.exports = router;
