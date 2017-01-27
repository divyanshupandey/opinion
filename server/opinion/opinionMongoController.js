//const UserModel = require('./UserEntity').UserModel;
const UserModel = require('./userEntity').UserModel;
const PartyModel = require('./partyEntity').PartyModel;
const EventModel = require('./eventEntity').EventModel;
const logger = require('./../../applogger');

let saveNewUser = function(newUserObj) {
  let promise = new Promise(function(resolve, reject) {

    let saveUserObj = new UserModel(newUserObj);

    saveUserObj.save(function(err, savedUserObj) {
      if (err) {
        reject(err);
      }

      if (!savedUserObj) {
        reject({
          error: 'Null User object created in mongo..!'
        });
      }
      logger.debug("successfully saved new User ", savedUserObj);
      resolve(savedUserObj);
    });
  })

  return promise;
}

let checkUser = function(userObj) {
  let promise = new Promise(function(resolve, reject) {

    UserModel.findOne(userObj, function(err, foundUser) {
      if (err) {
        reject(err);
      }

      if (!foundUser) {
        resolve({msg : 'failed'})
      }
      resolve({msg : 'success'});
    });
  })

  return promise;

}

let addParty = function(newPartyObj) {
  let promise = new Promise(function(resolve, reject) {

    let savePartyObj = new PartyModel(newPartyObj);

    savePartyObj.save(function(err, savedPartyObj) {
      if (err) {
        reject(err);
      }

      if (!savedPartyObj) {
        reject({
          error: 'Null Party object created in mongo..!'
        });
      }
      logger.debug("successfully saved new Party ", savedPartyObj);
      resolve(savedPartyObj);
    });
  })

  return promise;
}

let addEvent = function(newEventObj) {
  let promise = new Promise(function(resolve, reject) {

    let saveEventObj = new EventModel(newEventObj);

    saveEventObj.save(function(err, savedEventObj) {
      if (err) {
        reject(err);
      }

      if (!savedEventObj) {
        reject({
          error: 'Null Event object created in mongo..!'
        });
      }
      logger.debug("successfully saved new Event ", savedEventObj);
      resolve(savedEventObj);
    });
  })

  return promise;
}

let fetchEvents = function() {
  let promise = new Promise(function(resolve, reject) {

    EventModel.find({}, function(err, eventList) {
      if (err) {
        reject(err);
      }

      logger.debug('events', eventList);
      resolve(eventList);
    });
  })

  return promise;

}

let fetchParties = function(eventList) {
  let promise = new Promise(function(resolve, reject) {

    PartyModel.find({}, function(err, partyList) {
      if (err) {
        reject(err);
      }

      logger.debug('parties', partyList);
      logger.debug('eventList', eventList);
      resolve({eventList: eventList, partyList: partyList});
    });
  })

  return promise;

}

let fetchEmails = function() {
  let promise = new Promise(function(resolve, reject) {

    UserModel.find({}, 'email', function(err, emailList) {
      if (err) {
        reject(err);
      }

      logger.debug('emails', emailList);
      resolve(emailList);
    });
  })

  return promise;

}

let checkUserCallback = function(userObj, callback) {
  checkUser(userObj)
  .then(
    function(foundUser) {
      callback(null, foundUser);
    },
    function(err) {
      callback(err, null);
    });
}

let saveNewUserCallBack = function(newUserObj, callback) {
  saveNewUser(newUserObj)
  .then(
    function(savedUserObj) {
      callback(null, savedUserObj);
    },
    function(err) {
      callback(err, null);
    });
}

let addPartyCallback = function(partyObj, callback) {
  addParty(partyObj)
  .then(
    function(obj) {
      callback(null, obj);
    },
    function(err) {
      callback(err, null);
    });
}

let addEventCallBack = function(eventObj, callback) {
  addEvent(eventObj)
  .then(
    function(obj) {
      callback(null, obj);
    },
    function(err) {
      callback(err, null);
    });
}

let fetchEventsCallBack = function(callback) {
  fetchEvents()
  .then(
    function(obj) {
      callback(null, obj);
    },
    function(err) {
      callback(err, null);
    });
}

let fetchPartiesCallback = function(eventList , callback) {
  fetchParties(eventList)
  .then(
    function(obj) {
      callback(null, obj);
    },
    function(err) {
      callback(err, null);
    });
}

let fetchEmailsCallBack = function(callback) {
  fetchEmails()
  .then(
    function(obj) {
      callback(null, obj);
    },
    function(err) {
      callback(err, null);
    });
}

module.exports = {
  saveNewUserCallBack: saveNewUserCallBack,
  checkUserCallback: checkUserCallback,
  checkUser: checkUser,
  saveNewUser: saveNewUser,
  addPartyCallback: addPartyCallback,
  addParty: addParty,
  addEventCallBack: addEventCallBack,
  addEvent: addEvent,
  fetchEventsCallBack: fetchEventsCallBack,
  fetchEvents: fetchEventsCallBack,
  fetchParties: fetchParties,
  fetchPartiesCallback: fetchPartiesCallback,
  fetchEmailsCallBack: fetchEmailsCallBack,
  fetchEmails: fetchEmails
}
