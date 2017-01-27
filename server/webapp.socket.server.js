/*eslint no-undefined: 0 */
/*eslint no-undef-init: 0*/
let io = require('socket.io')();
let redis = require('redis');
let config = require('../config/');
let logger = require('../applogger');
let redisClient = undefined;

io.on('connection', function(socket) {
  logger.debug("subscribing to client socket connection..!");

  if (!redisClient) {
    redisClient = redis.createClient({
      host: config.REDIS.host,
      port: config.REDIS.port
    });
  }

  //subscribe to common updates from all the services (actors) of Oxygen
//  redisClient.subscribe('oxygen:onServiceUpdate');

  redisClient.subscribe('opinion:onServiceUpdate');

  redisClient.on('message', function(channel, chDataStr) {

    //let socketEventName = 'oxygen::progressUpdate';
    //let socketEventName1 = 'oxygen::dataUpdate';

    let socketEventName = 'opinion::progressUpdate';
    let socketEventName1 = 'opinion::dataUpdate';

    let chData = JSON.parse(chDataStr);
    let socketEventData = {
      'data': chData
    };


    logger.debug("Got message from channel ", channel, " data is: ", chData);

    //create socketEvent
    // var socketEventName = 'oxygen::progressUpdate' + '::' + chData.domainName;


    logger.debug('Emiting Socket event: ', socketEventName, ' data: ', socketEventData);
    socket.emit(socketEventName, socketEventData);
    socket.emit(socketEventName1, socketEventData);


  });

  socket.on('disconnect', function() {
    if (redisClient) {
      redisClient.unsubscribe();
      redisClient.quit();
      redisClient = undefined;
    }
  });
});

module.exports = io;
