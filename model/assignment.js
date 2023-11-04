import Query from "../utills/QueryHelper.js";
import getRedishData , { setRedishData }from "../utills/RedisHelper.js";

class Assignment {
  create = async (assignmentData) => {
    try {
      const query = `
        INSERT INTO Assignments (assignment_id, description, published_at, due_date, user_id, attachment_id, subject) 
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
      const data = await Query(query, [
        assignmentData.assignment_id,
        assignmentData.description,
        assignmentData.published_at,
        assignmentData.due_date,
        assignmentData.user_id,
        assignmentData.attachment_id,
        assignmentData.subject,
      ]);
      return await this.findById(assignmentData.assignment_id);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  update = async (id, assignmentData) => {
    try {
      const updateValues = Object.keys(assignmentData).map((key) => `${key} = ?`);
      const query = `UPDATE Assignments SET ${updateValues.join(", ")} WHERE assignment_id = ?;`;
      const values = [...Object.values(assignmentData), id];
      const data = await Query(query, values);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  delete = async (assignment_id, user_id) => {
    try {
      const deleteTagsQuery = `DELETE FROM AssignmentStudentTag WHERE assignment_id = ?;`;
      await Query(deleteTagsQuery, [assignment_id]);

      const deleteAssignmentQuery = `DELETE FROM Assignments WHERE assignment_id = ? AND user_id = ?;`;
      const data = await Query(deleteAssignmentQuery, [assignment_id, user_id]);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  findById = async (assignment_id) => {
    try {
      const query = `SELECT * FROM Assignments WHERE assignment_id = ?;`;
      const data = await Query(query, [assignment_id]);
      return data;
    }
    catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  teacherFeed = async (teacherId) => {
    try {
      let key = `teacherFeed:${teacherId}`;
      console.log("Trying to get from Cache");
      let result = await getRedishData(key);
      if (result) {
        console.log("Got it from Cache");
        return JSON.parse(result);
      } else {
        let query = `SELECT * FROM Assignments WHERE user_id = ?;`;
        const data = await Query(query, [teacherId]);
        await setRedishData(key, JSON.stringify(data));
        console.log("Setting in Cache");
        return data;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  // Modified addScore method
  addScore = async (score, student_id, assignment_id) => {
    try {
      let addScoreQuery = `UPDATE SubmitedAssignmets SET score = "${score}" WHERE assignment_id = "${assignment_id}" AND student_id = "${student_id}";`;

      const data = await Query(addScoreQuery);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

export default Assignment;

/*

  let assignment_id = uuidv4();
  const assignmentData = {
    assignment_id: assignment_id,
    description: req.body.description,
    published_at: req.body.published_at,
    user_id: req.user_id,
    attachment_id: attachment_id,
  };


  Assignments :
		// assignment_id (Primary Key)
		description - done
		published_at - done
		attachment_type : file, url
		user_id - (foreign key)
		attachment_id - (foreign Key)

	Attachments Table :
		attachment_id
		attachment_type - image, url, Video, PDF
		attachment_data
	
	AssignmentstudentTag Table :
		tag_id (Primary Key)
		assignment_id : (foreign key)
		student_id 
		scheduled_for
*/
