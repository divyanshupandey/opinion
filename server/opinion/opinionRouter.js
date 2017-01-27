'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const opinionCtrl = require('./opinionController');
const datapublisher = require('../serviceLogger/redisLogger');

// send otp
router.post('/otp', function(req, res) {

    let otp =''+req.body.otp;
    let email =''+req.body.email;
    logger.debug('sending otp ************'+otp);
    let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pandey.divyanshu34@gmail.com', // Your email id
        pass: 'Kamla&31' // Your password
    }
});
var mailOptions = {
    from: 'pandey.divyanshu34@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Your OTP', // Subject line
    text: otp,
    html : '<b> One time Password </b>'+otp
}

transporter.sendMail(mailOptions, function(error, info){
    if(error){
    logger.debug(error);
        res.send({err: 'error'});
    }else{
    logger.debug('Message sent: ' + info.response);
        res.send({otp: info.response});
    };
});

});

router.post('/signup', function(req, res) {
    logger.debug('sign up');
    let email =''+req.body.email;
    let user = 'user';
    if(email==='pandey.divyanshu34@gmail.com')
    {
        user='admin';
    }
    let userObj={ name: req.body.name,
                 email: email,
                password: req.body.password,
                type: user };
                try {

                  opinionCtrl.signup(userObj)
                    .then(function(savedUserObj) {
                        logger.debug("Successfully published new User: ",
                          savedUserObj.name);
                          var token = jwt.sign({email : email , user : user},'div');
                          logger.debug(token);
                          res.send({token : token});
                        return;
                      },
                      function(err) {
                        logger.error("Encountered error in publishing a new User: ",
                          err);
                        res.status(500).send({
                          error: 'Failed to complete operation...!'
                        });
                        return;
                      });
                } catch (err) {
                  logger.error("Caught a error in posting new User ", err);
                  res.status(500).send({
                    error: "Something went wrong, please try later..!"
                  });
                  return;
                }
});


router.post('/login', function(req, res) {
    logger.debug('login');
    let email =''+req.body.email;
    let user = 'user';
    if(email==='pandey.divyanshu34@gmail.com')
    {
        user='admin';
    }
    let userObj={ email: email,
                password: req.body.password
                };
                try {

                  opinionCtrl.login(userObj)
                    .then(function(userMsg) {
                        logger.debug("Successfully checked user login: ",
                          userMsg.msg);
                          if(userMsg.msg === 'success')
                          {
                          var token = jwt.sign({email : email , user : user},'div');
                          logger.debug(token);
                          res.send({token : token , msg : userMsg.msg});
                          }
                          else {
                           res.send({msg : userMsg.msg});
                          }
                        return;
                      },
                      function(err) {
                        logger.error("Encountered error in checking user login : ",
                          err);
                        res.status(500).send({
                          error: 'Failed to complete operation...!'
                        });
                        return;
                      });
                } catch (err) {
                  logger.error("Caught a error in checking login ", err);
                  res.status(500).send({
                    error: "Something went wrong, please try later..!"
                  });
                  return;
                }
});

// Create new party
router.post('/party', function(req, res) {

  try {

    let newPartyObj = req.body;
    logger.debug("for adding new party ");

    opinionCtrl.indexNewParty(newPartyObj)
      .then(function(savedPartyObj) {
          logger.debug("Successfully indexed new party: ",
            savedPartyObj.name);
          res.send(savedPartyObj);
          return;
        },
        function(err) {
          logger.error("Encountered error in indexing a new party: ",
            err);
          res.status(500).send({
            error: 'Failed to complete operation...!'
          });
          return;
        });
  } catch (err) {
    logger.error("Caught a error in posting new party ", err);
    res.status(500).send({
      error: "Something went wrong, please try later..!"
    });
    return;
  }
});

// Create new event
router.post('/event', function(req, res) {

  try {

    let newEventObj = req.body;
    logger.debug('for adding a new event');

    opinionCtrl.indexNewEvent(newEventObj)
      .then(function(savedEventObj) {
          logger.debug("Successfully indexed new event: ",
            savedEventObj.eventName);
          res.send(savedEventObj);
          return;
        },
        function(err) {
          logger.error("Encountered error in indexing a new event: ",
            err);
          res.status(500).send({
            error: 'Failed to complete operation...!'
          });
          return;
        });
  } catch (err) {
    logger.error("Caught a error in posting new party ", err);
    res.status(500).send({
      error: "Something went wrong, please try later..!"
    });
    return;
  }
});

//get all events and parties
router.get('/:user', function(req, res) {
  try {
      logger.debug(
        "going to fetch all events and parties");
    opinionCtrl.fetchEventsAndParties({email :req.params.user}).then(function(obj) {
        logger.debug(
          "Successfully retrieved all details to show ----->",
          obj);
        res.send(obj);
        return;
      },
      function(err) {
        logger.error(
          "Encountered error in retriving events and parties ",
          err);
        res.send(err);
        return;
      })

  } catch (err) {
    logger.error("Caught a error in retriving events and parties ", err);
    res.status(500).send({
      error: "Something went wrong, please try later..!"
    });
    return;
  }
});

// get all emails
router.get('/', function(req, res) {
  try {
      logger.debug(
        "going to fetch all emails");
    opinionCtrl.fetchEmails().then(function(obj) {
        logger.debug(
          "Successfully retrieved all emails ----->",
          obj);
        res.send(obj);
        return;
      },
      function(err) {
        logger.error(
          "Encountered error in retriving emails ",
          err);
        res.send(err);
        return;
      })

  } catch (err) {
    logger.error("Caught a error in retriving emails ", err);
    res.status(500).send({
      error: "Something went wrong, please try later..!"
    });
    return;
  }
});

// add like
router.post('/like', function(req, res) {

  try {

    let likeObj = req.body;
    logger.debug("for adding new like ");

    opinionCtrl.indexNewLike(likeObj)
      .then(function(savedLikeObj) {
          logger.debug("Successfully indexed new like: ");

    opinionCtrl.fetchEventsAndParties({email : likeObj.email})
              .then(function(resultObj) {
                  logger.debug("Successfully fetched latest eventList: ",
                    resultObj.eventList);
                 let eList = JSON.parse(JSON.stringify(resultObj.eventList));
                 let redisIntent = {
                   actor: 'like updater',
                   status: 'like update completed',
                   eventList: eList
                 }
                 datapublisher.updateLikes(redisIntent);
                  res.send(resultObj.eventList);
                  return;
                },
                function(err) {
                  logger.error("Encountered error in fetching latest eventList ",
                    err);
                  res.status(500).send({
                    error: 'Failed to complete operation...!'
                  });
                  return;
                });

          return;
        },
        function(err) {
          logger.error("Encountered error in indexing a new like: ",
            err);
          res.status(500).send({
            error: 'Failed to complete operation...!'
          });
          return;
        });
  } catch (err) {
    logger.error("Caught a error in posting new like ", err);
    res.status(500).send({
      error: "Something went wrong, please try later..!"
    });
    return;
  }
});


module.exports = router;
