let oxygen = {
  WWW_PORT: process.env.OXYGEN_WWW_PORT || process.env.PORT || 8080
}

let mongo = {
  host: process.env.MONGO_HOST || '127.0.0.1',
  port: process.env.MONGO_PORT || 27017,
  usr: process.env.MONGO_USR || 'mongo',
  pwd: process.env.MONGO_PWD || 'mongo',
  masterDB: process.env.MONGO_DB || 'oxygen'
};
//@ TODO use mongo username & password in constructing the URL if given
mongo['mongoURL'] = ('mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.masterDB);

let neo4j = {
  host: process.env.NE04J_HOST || '127.0.0.1',
  http: process.env.NEO4J_HTTP_PORT || 7474,
  bolt: process.env.NEO4J_BOLT_PORT || 7687,
  usr: process.env.NEO4J_USR || 'neo4j',
  pwd: process.env.NEO4J_PWD || 'password'
};
//@ TODO use neo4j username & password in constructing the URL if given
neo4j['neo4jURL'] = ('bolt://' + neo4j.host + ':' + neo4j.bolt);
neo4j['neo4jHTTPURL'] = ('http://' + neo4j.host + ':' + neo4j.http);

let redis = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
}
  // redis['redisURL'] = ('redis://user:password@host:port/db-number');

  let rabbitMQ = {
    host: process.env.RABBITMQ_HOST || '127.0.0.1',
    port: process.env.RABBITMQ_PORT || 5672
  };
  rabbitMQ['rabbitmqURL'] = ('amqp://' + rabbitMQ.host + ':' + rabbitMQ.port);

  let config = {
    OXYGEN: oxygen,
    MONGO: mongo,
    NEO4J: neo4j,
    REDIS: redis,
    RABBITMQ: rabbitMQ,
    NO_OF_RESULTS: 11
  };

  module.exports = config;
