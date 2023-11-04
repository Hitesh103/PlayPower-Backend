import { connection } from "../config/db_connection.js";

function Query(query, params) {
  console.log("zxcv", query);
  return new Promise(function (resolve, reject) {
    connection.query(query, params, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export default Query;
