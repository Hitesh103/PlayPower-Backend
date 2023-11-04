import Query from "../utills/QueryHelper.js";

/*

	Attachments Table :
		attachment_id
		attachment_type - image, url, Video, PDF
		attachment_data

    attachment_id	attachment_type	attachment_data	
*/

class Attachment {
  create = async (attachment_id, attachment_data) => {
    try {
      const query = `
        INSERT INTO Attachments (attachment_id, attachment_data)
        VALUES ("${attachment_id}", "${attachment_data}");
      `;
      const data = await Query(query);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  update = async(attachment_id, attachment_data, attachment_type) => {
    try {
      const query = `
        UPDATE Attachments 
        SET attachment_data = "${attachment_data}", attachment_type = "${attachment_type}" 
        WHERE attachment_id = "${attachment_id}";
      `;
      console.log(query);
      const data = await Query(query);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

export default Attachment;
