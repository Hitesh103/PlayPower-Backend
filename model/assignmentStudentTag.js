import Query from "../utills/QueryHelper.js";
import getRedishData, { setRedishData } from "../utills/RedisHelper.js";

class AssignmentStudentTag {
  create = async (assignment_id, students) => {
    try {
      let query = `INSERT INTO AssignmentStudentTag (assignment_id, student_id) VALUES `;
      const values = [];

      for (const student of students) {
        values.push(`(?, ?)`);
      }

      query += values.join(", ");
      const flattenedValues = students.reduce((acc, student) => [...acc, assignment_id, student], []);
      const data = await Query(query, flattenedValues);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  updateTaggedStudents = async (assignment_id, students) => {
    try {
      let deleteQuery = `DELETE FROM AssignmentStudentTag WHERE assignment_id = ?;`;
      const deleteData = await Query(deleteQuery, [assignment_id]);
      
      if (deleteData.affectedRows >= 0) {
        return await this.create(assignment_id, students);
      } else {
        return false;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  studentFeed = async (studentId) => {
    try {
      let key = `studentfeed:${studentId}`;
      console.log("Trying to get from Cache");
      let result = await getRedishData(key);

      if (result) {
        console.log("Got it from Cache");
        return JSON.parse(result);
      } else {
        console.log("Not in Cache, fetching from DB");
        let query = `
          SELECT
            A.assignment_id,
            A.description,
            A.published_at,
            U.username AS author,
            SA.score
          FROM Assignments AS A
          JOIN Users AS U ON A.user_id = U.user_id
          LEFT JOIN Attachments AS a ON A.attachment_id = a.attachment_id
          JOIN AssignmentStudentTag AS AST ON A.assignment_id = AST.assignment_id
          LEFT JOIN SubmitedAssignmets AS SA ON A.assignment_id = SA.assignment_id
          WHERE AST.student_id = ? AND A.published_at <= NOW();
        `;
        const data = await Query(query, [studentId]);
        await setRedishData(key, JSON.stringify(data));
        console.log("Setting in Cache");
        console.log(query);
        return data;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
}

export default AssignmentStudentTag;
