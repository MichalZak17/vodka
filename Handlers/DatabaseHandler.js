const mysql = require("mysql");
const { promisify } = require("util");
const { LogHandler } = require("./LogHandler");

require("colors");

function CatchError(err, query) {
    console.log(`[!]`.red + ` An error occured while executing the query: ${query}`.red + ` Error: ${err}`.white)
    LogHandler.logException(err);
}

class DatabaseHandler {  
  static pool = mysql.createPool({
    connectionLimit: 10,
    host: "192.168.1.61",
    user: "me",
    password: "",
    database: "discord_new",
  });

  static async query(query) {
    try { return await promisify(this.pool.query).call(this.pool, query); } 
    catch (err) { CatchError(err, query); }
  }

  static async log(server_id, logging_level = "info", message) {
    const query = `INSERT INTO events (server_id, log_level, message) VALUES ('${server_id}', '${logging_level}', '${message}')`
    try { return await promisify(this.pool.query).call(this.pool, query); }
    catch (err) { CatchError(err, query); }
  }

  static async addHistory(user_id, other_user_id, transaction_type, balance) {
    const transaction_types = ["attack", "bet", "transfer"]
    if (!transaction_types.includes(transaction_type)) { new Error("Invalid transaction type."); }

    const query = `INSERT INTO history (user_id, other_user, transaction_type, balance) VALUES ('${user_id}', '${other_user_id}', '${transaction_type}', '${balance}')`
    try { return await promisify(this.pool.query).call(this.pool, query); }
    catch (err) { CatchError(err, query); }
  }
}

module.exports = { DatabaseHandler };
