import Query from "../utills/QueryHelper.js";

class User {
  create = async (user) => {
    try {
      // { username: 'hp112', password: 1235678, role: isStudent, email: 'hp112@gmail' }
      console.log(user);
      let query = `
            INSERT INTO Users (user_id, username, password, role, email)
            VALUES ( "${user.user_id}" ,"${user.username}", "${user.password}", '${user.role}', "${user.email}");
            `;
      console.log(query);
      const data = await Query(query);
      console.log(data);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  findOne = async ({ username }) => {
    try {
      let query = `
        SELECT * FROM Users WHERE username = "${username}" LIMIT 1;
      `;
      const data = await Query(query);
      return data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  findById = async ({ id }) => {
    try {
      let query = `
        SELECT * FROM Users WHERE user_id = "${id}";
      `;
      // console.log("11111111111111111111111111111111111111111111111  --  ",query);
      const data = await Query(query);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default User;
