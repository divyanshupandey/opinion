const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');

let indexNewUser = function(newUserObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index new user: ", newUserObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");

    let query = 'MERGE (d:USERS {email:{email}}) return d';
    let params = {
      email: newUserObj.email
    };

    session.run(query, params)
    .then(function(result) {
        session.close();
        resolve(newUserObj);
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let indexEvent = function(newEventObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index new event: ", newEventObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");

    let query = 'MERGE (d:'+newEventObj.eventName+' {name:{name}}) return d';
    let params = {
      name: newEventObj.party
    };

    session.run(query, params)
    .then(function(result) {
        session.close();
        resolve(newEventObj);
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let likesForParty = function(eventObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to fetch likesForParty ", eventObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (e:' +eventObj.eventName +
    ' {name:{name}}) ';
    query += 'MATCH(u:USERS) ';
    query += 'MATCH(e)<-[r]-(u) '
    query += ' where type(r) in ["Likes"] ';
    query += 'return count(r)';
    let params = {
      name: eventObj.party
    };

    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result from neo4j: ", record);
        record._fields.forEach(function(fields) {
          logger.debug("Result from neo4j fields: ", fields);
                  resolve({name: eventObj.party, likes : fields.low , likedColor : ''});
        });
      });
        session.close();
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let likesByUser = function(eventObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to fetch likesByUser ", eventObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");
     let query = 'Match (u:USERS {email:{email}}) Match(e:'+eventObj.eventName+')';
         query+= ' Match(e)<-[r:Likes]-(u) return e.name ';
    logger.debug("the query for user likes ",query);

    let params = {
      email: eventObj.user
    };


        session.run(query, params)
        .then(function(result) {
          if(result.records.length === 0)
          {
            let eItem =   JSON.parse(JSON.stringify(eventObj.eventItem));
            eItem.liked = '';
            resolve({eItem: eItem});
          }
          result.records.forEach(function(record) {
            if(record.length === 0)
            {
              let eItem =   JSON.parse(JSON.stringify(eventObj.eventItem));
              eItem.liked = '';
              resolve({eItem: eItem});
            }
            logger.debug("Result from neo4j: ", record);
            record._fields.forEach(function(fields) {
              logger.debug("Result from neo4j fields: ", fields);
                      let eItem =   JSON.parse(JSON.stringify(eventObj.eventItem));
                      eItem.liked = fields;
                      resolve({eItem: eItem});
            });
          });
            session.close();
          })
        .catch(function(err) {
          logger.error("Error in neo4j query: ", err, ' query is: ',
            query);
          reject(err);
        });
      });

      return promise;
}

let detachLike = function(likeObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to detachLike ", likeObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");

    let query ='MATCH(u:USERS {email:{email}})';
    query += 'MATCH(e:'+likeObj.eventName+') ';
    query += 'MATCH(e)<-[r:Likes]-(u) '
    query += '  detach delete r ';
    let params = {
      email: likeObj.email
    };

    session.run(query, params)
    .then(function(result) {
      if(result.records.length === 0)
      {
      resolve({obj : likeObj});
      }
        session.close();
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}


let indexLike = function(likeObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to indexLike ", likeObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
      );

    let session = driver.session();
    logger.debug("obtained connection with neo4j");

    let query ='MATCH(u:USERS {email:{email}})';
    query += 'MATCH(e:'+likeObj.eventName+' {name: {name}}) ';
    query += 'MERGE(e)<-[r:Likes]-(u) '
    query += '  return r ';
    let params = {
      email: likeObj.email,
      name: likeObj.party
    };

    session.run(query, params)
    .then(function(result) {
      if(result.records.length > 0)
      {
      resolve({obj : likeObj});
      }
        session.close();
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let indexNewUserCallBack = function(newUserObj, callback) {
  indexNewUser(newUserObj).then(function(indexeduserObj) {
    callback(null, indexeduserObj);
  }, function(err) {
    callback(err, null);
  });
}

let indexEventCallBack = function(newEventObj, callback) {
  indexEvent(newEventObj).then(function(indexeduserObj) {
    callback(null, indexeduserObj);
  }, function(err) {
    callback(err, null);
  });
}

let likesForPartyCallBack = function(newEventObj, callback) {
  likesForParty(newEventObj).then(function(likesObj) {
    callback(null, likesObj);
  }, function(err) {
    callback(err, null);
  });
}

let likesByUserCallBack = function(newEventObj, callback) {
  likesByUser(newEventObj).then(function(likesObj) {
    callback(null, likesObj);
  }, function(err) {
    callback(err, null);
  });
}

let detachLikeCallBack = function(newLikeObj, callback) {
  detachLike(newLikeObj).then(function(likesObj) {
    callback(null, likesObj);
  }, function(err) {
    callback(err, null);
  });
}

let indexLikeCallBack = function(newLikeObj, callback) {
  indexLike(newLikeObj).then(function(likesObj) {
    callback(null, likesObj);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  indexNewUserCallBack: indexNewUserCallBack,
  indexNewUser: indexNewUser,
  indexEventCallBack: indexEventCallBack,
  indexEvent: indexEvent,
  likesForPartyCallBack: likesForPartyCallBack,
  likesForParty: likesForParty,
  likesByUserCallBack: likesByUserCallBack,
  likesByUser: likesByUser,
  detachLikeCallBack: detachLikeCallBack,
  detachLike: detachLike,
  indexLikeCallBack: indexLikeCallBack,
  indexLike: indexLike
}
