import { connection } from "../config/db_connection.js";

function Query(query) {
  return new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export default Query;
