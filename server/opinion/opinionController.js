'use strict';
const opinionNeo4jController = require('./opinionNeo4jController');
const opinionMongoController = require('./opinionMongoController');
const logger = require('./../../applogger');

const async = require('async');

let signup = function(newUserObj) {
  logger.debug('Received request for saving new User: ', newUserObj);
//Save to Mongo DB
//Save to Neo4j

let promise = new Promise(function(resolve, reject) {
  if (!newUserObj.name ||
    newUserObj.name.length <= 2) {
    reject({
      error: 'Invalid user name..!'
    });
}

async.waterfall([function(callback) {
  opinionMongoController.saveNewUserCallBack(newUserObj,
    callback);
},
function(savedUserObj, callback) {
  logger.debug('Got saved user object for indexing: ',
    savedUserObj);
  opinionNeo4jController.indexNewUserCallBack(savedUserObj,
    callback)
}
],
function(err, indexedUserObj) {
  if (err) {
    logger.error("Error in publishNewUser : ", err)
    reject(err);
  }
  if (indexedUserObj) {
    resolve(indexedUserObj);
      } else {
        reject({
          error: 'Null indexed object was returned..!'
        });
      }
    }); //end of async.waterfall
});

return promise;
}

let login = function(userObj) {
  logger.debug("Received request for checking user logim: ",
  userObj);

  let promise = new Promise(function(resolve, reject) {

    async.waterfall([function(callback) {
    opinionMongoController.checkUserCallback(userObj,
        callback);
      }
        ],
        function(err, loginMsg) {
          if (err) {
            reject(err);
          }
          resolve(loginMsg);
        }); //end of async.waterfall
      });
      return promise;
    }

    let indexNewParty = function(partyObj) {
      logger.debug("Received request for adding a new party ",
      partyObj);

      let promise = new Promise(function(resolve, reject) {

        async.waterfall([function(callback) {
        opinionMongoController.addPartyCallback(partyObj,
            callback);
          }
            ],
            function(err, resObj) {
              if (err) {
                reject(err);
              }
              logger.debug("after adding the new party ",
              resObj);
              resolve(resObj);
            }); //end of async.waterfall
          });
          return promise;
        }

        let indexNewEvent = function(eventObj) {
          logger.debug('Received request for saving new event : ', eventObj);
        //Save to Mongo DB
        //Save to Neo4j

        let promise = new Promise(function(resolve, reject) {
          if (!eventObj.eventName ||
          eventObj.eventName.length <= 2) {
            reject({
              error: 'Invalid event name..!'
            });
        }

        async.waterfall([function(callback) {
          logger.debug('going to mongo for saving event ')
          opinionMongoController.addEventCallBack(eventObj,
            callback);
        },
        function(savedEventObj, callback) {
          logger.debug('Got saved event object for indexing: ',
            savedEventObj);
            if (savedEventObj.length === 0) {
              callback(null, savedEventObj);
            } else {
              let parties = [];
              let party = {};
              logger.debug('parties', savedEventObj.parties)
              let partyList = JSON.parse(JSON.stringify(savedEventObj.parties));
              for (let item in partyList) {
                party = {}
                logger.debug('item',item)
                party.name = JSON.parse(JSON.stringify(partyList[item]));
                party.likes = 0;
                party.likedColor = '';
                parties.push(party);
                logger.debug(party.name);
                logger.debug(parties);
                saveEventIntermediate({party: party.name ,
                  eventName: savedEventObj.eventName})
                  .then(function(Obj) {
                  if (parties.length === savedEventObj.parties.length) {
                  logger.debug(parties);
                   savedEventObj.parties = parties;
                   callback(null, savedEventObj);
               }
             },
             function(err) {
               logger.error(
                 "Encountered error in saving new event: ",
                 err);
               reject(err);
               return;
             });
            }
          }
        }
        ],
        function(err, indexedEventObj) {
          if (err) {
            logger.error("Error in indexing new event : ", err)
            reject(err);
          }
          if (indexedEventObj) {
            let liked = '';
            indexedEventObj.liked = liked;
            logger.debug(' completed indexing ',indexedEventObj)
            resolve(indexedEventObj);
              } else {
                reject({
                  error: 'Null indexed object was returned..!'
                });
              }
            }); //end of async.waterfall
        });

        return promise;
        }

        let fetchEventsAndParties = function(userObj) {
          logger.debug('Received request for fetching events and parties : ', userObj);

        let promise = new Promise(function(resolve, reject) {

        async.waterfall([function(callback) {
          logger.debug('going to mongo for fetching events ')
          opinionMongoController.fetchEventsCallBack(callback);
        },
        function(eventList, callback) {
          logger.debug('fetched events: ',
            eventList);
            if (eventList.length === 0) {
              callback(null, eventList);
            } else {
              let eList = [];
              eventList.map((eventItem,i) =>{
                let parties = [];
                let party = {};
                logger.debug('parties', eventItem.parties)
                let partyList = JSON.parse(JSON.stringify(eventItem.parties));
              for (let item in partyList) {
                logger.debug('item',item)
                party.name = JSON.parse(JSON.stringify(partyList[item]));

                logger.debug('party name',party.name);
                logger.debug(parties);
                fetchLikesIntermediate({eventName: eventItem.eventName
                  ,party: party.name })
                  .then(function(Obj) {
                    parties.push(Obj);
                    logger.debug(parties);
                   if (parties.length === eventItem.parties.length)
                   {
                      eventItem.parties = parties;
                      eList.push('event');
                   }
                  if (parties.length === eventItem.parties.length &&
                   eList.length === eventList.length
                  ) {
                   callback(null, eventList);
               }
             },
             function(err) {
               logger.error(
                 "Encountered error in fetching parties likes ",
                 err);
               reject(err);
               return;
             });
              }
            });
            }
        },

        function(eventList, callback) {
          logger.debug('fetched events: ',
            eventList);
            if (eventList.length === 0) {
              callback(null, eventList);
            } else {

              let eList= [];
              eventList.map((eventItem,i) =>{
                let item =   JSON.parse(JSON.stringify(eventItem));
                fetchUserLikesIntermediate({user: userObj.email,
                  eventName: eventItem.eventName, eventItem: item})
                  .then(function(Obj) {
                    let obj =  JSON.parse(JSON.stringify(Obj.eItem));
                    eList.push(obj);
                    logger.debug('eList ',eList);
                  if (eList.length === eventList.length) {
                   callback(null, eList);
               }
             },
             function(err) {
               logger.error(
                 "Encountered error in fetching user likes: ",
                 err);
               reject(err);
               return;
             });
            });
            }
        },

        function(eventList,callback) {
          logger.debug('going to mongo for fetching parties ',eventList)
          opinionMongoController.fetchPartiesCallback(eventList,callback);
        }

        ],
        function(err, obj) {
          if (err) {
            logger.error("Error in fetching parties and events : ", err)
            reject(err);
          }
          if (obj) {
            logger.debug(' completed fetching parties and events ',obj)
            resolve(obj);
              } else {
                reject({
                  error: 'Null indexed object was returned..!'
                });
              }
            }); //end of async.waterfall
        });

        return promise;
        }

        let fetchLikesIntermediate = function(newEventObj) {

          logger.debug("Received request for fetching likes ", newEventObj);
          let promise = new Promise(function(resolve, reject) {
            async.waterfall([
              function(callback) {
                opinionNeo4jController.likesForPartyCallBack(newEventObj,
                  callback);
              }
              ],
              function(err, eventObj) {
                if (err) {
                  reject(err);
                }
                resolve(eventObj);
              }); //end of async.waterfall
          });

          return promise;
        }

        let fetchUserLikesIntermediate = function(newEventObj) {

          logger.debug("Received request for fetching user likes ", newEventObj);
          let promise = new Promise(function(resolve, reject) {
            async.waterfall([
              function(callback) {
                opinionNeo4jController.likesByUserCallBack(newEventObj,
                  callback);
              }
              ],
              function(err, eventObj) {
                if (err) {
                  reject(err);
                }
                resolve(eventObj);
              }); //end of async.waterfall
          });

          return promise;
        }

        let saveEventIntermediate = function(newEventObj) {

          logger.debug("Received request for saving new event ", newEventObj);
          let promise = new Promise(function(resolve, reject) {
            async.waterfall([
              function(callback) {
                opinionNeo4jController.indexEventCallBack(newEventObj,
                  callback);
              }
              ],
              function(err, eventObj) {
                if (err) {
                  reject(err);
                }
                resolve(eventObj);
              }); //end of async.waterfall
          });

          return promise;
        }

        let indexNewLike = function(newLikeObj) {

          logger.debug("Received request for indexNewLike ", newLikeObj);
          let promise = new Promise(function(resolve, reject) {
            async.waterfall([
              function(callback) {
                opinionNeo4jController.detachLikeCallBack(newLikeObj,
                  callback);
              },
              function(resultObj,callback) {
                opinionNeo4jController.indexLikeCallBack(newLikeObj,
                  callback);
              }
              ],
              function(err, resultObj) {
                if (err) {
                  reject(err);
                }
                resolve(resultObj);
              }); //end of async.waterfall
          });

          return promise;
        }

        let fetchEmails = function() {

          logger.debug("Received request for fetching emails ");
          let promise = new Promise(function(resolve, reject) {
            async.waterfall([
              function(callback) {
                opinionMongoController.fetchEmailsCallBack(
                  callback);
              }
              ],
              function(err, emailObj) {
                if (err) {
                  reject(err);
                }
                resolve(emailObj);
              }); //end of async.waterfall
          });

          return promise;
        }

module.exports = {
  signup: signup,
  login: login,
  indexNewParty: indexNewParty,
  indexNewEvent: indexNewEvent,
  saveEventIntermediate: saveEventIntermediate,
  fetchEventsAndParties: fetchEventsAndParties,
  fetchLikesIntermediate: fetchLikesIntermediate,
  fetchUserLikesIntermediate: fetchUserLikesIntermediate,
  indexNewLike: indexNewLike,
  fetchEmails: fetchEmails
}
