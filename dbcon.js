var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_junkmand',
  password        : '6387',
  database        : 'cs290_junkmand'
});

module.exports.pool = pool;
