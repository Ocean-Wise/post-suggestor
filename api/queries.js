var promise = require('bluebird');
var mailjet = require('node-mailjet')
    .connect('fb81f69b6aff4ff4b3d96b4dac601f07', '1db16422565f7ae3c39b8537ed17dfe4');

function turnOnLogging() {
  var log = adal.Logging;
  log.setLoggingOptions(
    {
      level: log.LOGGING_LEVEL.VERBOSE,
      log : function(level, message, error) {
        console.log(message);
        if (error) {
          console.log(error);
        }
      }
    }
  );
}

var options = {
  // Initialization options for database
  promiseLib: promise
};

const cn = {
  host: 'db', // Container name from docker-compose.yml
  port: 5432, // Database port
  database: 'blogposts', // Name of the database
  user: 'blogsuggestor', // Database username
  password: 'd8h*_z6a#SJ=cFfw' // Database password
}

var pgp = require('pg-promise')(options);
var db = pgp(cn);

function getPosts(req, res, next) {
  try {
  db.any('select * from posts')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL posts'
        });
    })
    .catch(function (error) {
      return next(error);
    });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

function lauraMail(req, res, next) {
  try {
    console.log(req.body);
    var request = mailjet
        .post("send")
        .request({
          "FromEmail": "ethanjdinnen@gmail.com",
          "FromName": "NO REPLY",
          "Subject": "New Aquablog post!",
          "Text-part": "An Aquablog post with the title " + req.body.body.title + " has been added to your workflow.",
          "Html-part": "<p>An Aquablog post with the title " + req.body.body.title + " has been added to your workflow.</p>",
          "Recipients": [
            {
              "Email": req.body.body.recipient
            }
          ]
        });
    request.then(result => {
      console.log(result);
      res.status(200).json({
        status: 'success',
        message: 'Sent email to ' + req.body.body.recipient
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: 'Email failed to send'
      });
    });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}


function sendMail(req, res, next) {
  try {
      console.log(req.body);
      var request = mailjet
          .post("send")
          .request({
            "FromEmail": "ethanjdinnen@gmail.com",
            "FromName": "NO REPLY",
            "Subject": "Your Aquablog post has been scheduled",
            "Text-part": "Your Aquablog post " + req.body.body.title + " has been scheduled for posting on " + req.body.body.date + " by end of day.",
            "Html-part": "<p>Your Aquablog post " + req.body.body.title + " has been scheduled for posting on " + req.body.body.date + " by end of day.</p>",
            "Recipients": [
              {
                "Email": req.body.body.recipient
              }
            ]
          });
      request.then(result => {
        console.log(result);
        res.status(200).json({
          status: 'success',
          message: 'Sent scheduling email to ' + req.body.body.recipient
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          status: 'error',
          message: 'Email failed to send'
        });
      });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

function getSinglePost(req, res, next) {
  try {
        console.log(tokenResponse);
        var postID = parseInt(req.params.id);
        db.one('select * from posts where id = $1', postID)
        .then(function(data) {
          res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE post'
          });
        })
        .catch(function(err) {
          return next(err);
        });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

function createPost(req, res, next) {
  try {
        console.log(req);
        db.none('INSERT into posts (Title, Type, Body, Images, Tags, Category, Date, Author, Email, Scheduled)' +
        'values(${Title}, ${Type}, ${Body}, ${Images}, ${Tags}, ${Category}, ${Date}, ${Author}, ${Email}, ${Scheduled})',
        req.body)
        .then(function () {
          res.status(200)
          .json({
            status: 'success',
            message: 'Created post'
          });
        })
        .catch(function(err) {
          return next(err);
        });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

function updatePost(req, res, next) {
  console.log(req);
  try {
    db.none('update posts set ' + req.body.column + '=$1 where id=$2',
    [req.body.value, parseInt(req.params.id)])
      .then(function() {
        res.status(200)
        .json({
          status: 'success',
          message: 'Updated date'
        });
      })
      .catch(function(err) {
        return next(err);
      });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

function removePost(req, res, next) {
  try {
    var pupID = parseInt(req.params.id);
    db.result('delete from posts where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
      .json({
        status: 'success',
        message: `Removed ${result.rowCount} post`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
  } catch(err) {
    res.status(401).send("Authorization error");
  }
}

module.exports = {
  getPosts: getPosts,
  getSinglePost: getSinglePost,
  sendMail: sendMail,
  lauraMail: lauraMail,
  createPost: createPost,
  updatePost: updatePost,
  removePost: removePost
};
