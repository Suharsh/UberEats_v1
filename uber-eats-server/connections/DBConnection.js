mysql = require('mysql');
var db;

function dbConnectionProvider() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 10,
            host: "<host>",
            user: "<user>",
            password: "<pass>",
            database:"<database>"
        });
    }
    return db;

}
module.exports = dbConnectionProvider();


