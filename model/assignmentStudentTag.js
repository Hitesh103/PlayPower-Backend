import Query from "../utills/QueryHelper.js";
import getRedishData , { setRedishData }from "../utills/RedisHelper.js";

class AssignmentStudentTag {
  create = async (assignment_id, students) => {
    try {

      console.log(assignment_id, students);
      let query = `
          INSERT INTO AssignmentStudentTag (assignment_id, student_id)
          VALUES `;

      // Create an array to hold the placeholders for each student
      const placeholders = [];

      // Loop through the students array and generate placeholders and values
      for (const student of students) {
        placeholders.push(`("${assignment_id}", "${student}")`);
      }

      console.log(placeholders);

      query += placeholders.join(", ");
      const data = await Query(query);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateTaggedStudents = async (assignment_id, students) => {
    try {
      let query = `DELETE FROM AssignmentStudentTag WHERE assignment_id = "${assignment_id}"`;
      const data = await Query(query);
      return await this.create(assignment_id, students);
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
      if(result){
        console.log("Got it from Cache");
        return JSON.parse(result);
      }else{
        console.log("Not in Cache fetching from DBy");
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
          LEFT JOIN SubmitedAssignmets AS SA ON A.assignment_id = SA.assignment_id  -- Join with SubmitedAssignmets to get the score
          WHERE AST.student_id = "${studentId}" AND A.published_at <= NOW();
        `;        
        const data = await Query(query);
        await setRedishData(key, JSON.stringify(data));
        console.log("Settting in Cache");
        console.log(query);
        // console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
}

export default AssignmentStudentTag;
