var mysql = require('promise-mysql');
var pool; //database handler
var settings = require('../settings');



exports.connect = function(done) {
  pool = mysql.createPool({
    host: settings.DB_HOST,
    // socketPath: settings.DB_SOCKET,
    user: settings.DB_USER,
    password: settings.DB_PASSWORD,
    database: settings.DB_NAME,
    port: settings.DB_PORT
    //insecureAuth: true
  });
  if (!pool) return done(new Error('Missing database connection.'))
  done();
};
exports.get = function() {
  return pool;
};