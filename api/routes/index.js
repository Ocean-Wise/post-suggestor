var express = require('express');
var router = express.Router();

var api = require('../queries');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/api/posts', api.getPosts);
router.get('/api/posts/:id', api.getSinglePost);
router.post('/api/posts', api.createPost);
router.post('/api/mail', api.sendMail);
router.post('/api/laura', api.lauraMail);
router.put('/api/posts/:id', api.updatePost);
router.delete('/api/posts/:id', api.removePost);

module.exports = router;
