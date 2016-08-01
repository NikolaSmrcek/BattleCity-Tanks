var express = require('express');
var path = require('path');
//var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../', 'views', 'index.html'));
});
*/

let proba = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../', 'views', 'index.html'));
}

exports.init = ({ app }) => {
    let router = express.Router();
    router.get('/', proba);
    app.use('/', router);
};

//module.exports = router;