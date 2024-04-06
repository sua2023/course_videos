var mysql = require("mysql2");
var conn = mysql.createConnection({

     connectionLimit: 1000,
     host: "localhost",
     user: "root",
     password: "",
     port: 3306,
     database: "cource_db"
})

conn.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});
module.exports = conn;