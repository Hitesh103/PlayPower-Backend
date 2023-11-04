  import Query from "../utills/QueryHelper.js";

  class User {
    create = async (user) => {
      try {
        console.log(user);
        const query = 'INSERT INTO Users (user_id, username, password, role, email) VALUES (?, ?, ?, ?, ?)';
        const data = await Query(query, [user.user_id, user.username, user.password, user.role, user.email]);
        console.log(data);
        return data.affectedRows > 0;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
  
    findOne = async ({ username }) => {
      try {
        const query = 'SELECT * FROM Users WHERE username = ? LIMIT 1';
        const data = await Query(query, [username]);
        return data[0];
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
  
    findById = async (id) => {
      try {
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        const data = await Query(query, [id]);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    
  }
  
  export default User;
  