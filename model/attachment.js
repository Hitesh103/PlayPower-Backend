import Query from "../utills/QueryHelper.js";

class Attachment {
  create = async (attachment_id, attachment_data) => {
    try {
      const query = `
        INSERT INTO Attachments (attachment_id, attachment_data)
        VALUES (?, ?);
      `;
      const data = await Query(query, [attachment_id, attachment_data]);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  update = async (attachment_id, attachment_data, attachment_type) => {
    try {
      const query = `
        UPDATE Attachments 
        SET attachment_data = ?, attachment_type = ? 
        WHERE attachment_id = ?;
      `;
      const data = await Query(query, [attachment_data, attachment_type, attachment_id]);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

export default Attachment;
