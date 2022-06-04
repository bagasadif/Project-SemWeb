var express = require('express');
var router = express.Router();

/* Controllers */
const indexcontroller = require('../controllers/index');

router.get('/', indexcontroller.index);

module.exports = router;
