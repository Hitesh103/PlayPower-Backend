import Query from "../utills/QueryHelper.js";
import getRedishData , { setRedishData }from "../utills/RedisHelper.js";

class Assignment {
  create = async (assignmentData) => {
    try {
      // assignment_id	description	published_at due_date  user_id	attachment_id

      const query = `
        INSERT INTO Assignments (assignment_id, description, published_at, due_date, user_id, attachment_id, subject) VALUES ( "${assignmentData.assignment_id}" ,"${assignmentData.description}", '${assignmentData.published_at}', "${assignmentData.due_date}","${assignmentData.user_id}", "${assignmentData.attachment_id}","${assignmentData.subject}")
      `;
      console.log(query);
      const data = await Query(query);
      console.log(data);
      return await this.findById(assignmentData.assignment_id);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  update = async (id, assignmentData) => {
    try {
      let query = `UPDATE Assignments SET `;
      const updateValues = [];

      for (const key in assignmentData) {
        if (assignmentData.hasOwnProperty(key)) {
          updateValues.push(`${key} = "${assignmentData[key]}"`);
        }
      }

      query += updateValues.join(", ");
      query += ` WHERE assignment_id = '${id}'`;

      console.log(query);

      const data = await Query(query);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  delete = async (assignment_id, user_id) => {
    try {
      const deleteTagsQuery = `
        DELETE FROM AssignmentStudentTag WHERE assignment_id = "${assignment_id}";
      `;
      await Query(deleteTagsQuery); // Delete associated tags first

      const deleteAssignmentQuery = `
        DELETE FROM Assignments WHERE assignment_id = "${assignment_id}" AND user_id = "${user_id}";
      `;
      const data = await Query(deleteAssignmentQuery);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  findById = async (assignment_id) => {
    try {
      const query = `
        SELECT * FROM Assignments WHERE assignment_id = "${assignment_id}";
      `;

      const data = await Query(query);

      return data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  teacherFeed = async (teacherId) => {
    try {
      let key = `teacherFeed:${teacherId}`;
      console.log("Trying to get from Cache");
      let result = await getRedishData(key);
      if(result){
        console.log("Got it from Cache");
        return JSON.parse(result);
      }else{
      let query = `
        SELECT * FROM Assignments WHERE user_id = "${teacherId}";
      `
      const data = await Query(query);
      await setRedishData(key, JSON.stringify(data));
      console.log("Settting in Cache"); 
      return data;
    }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  submit = async(assignment_id,user_id,desc) => {
    try {
      let submitQuery = `INSERT INTO SubmitedAssignmets (assignment_id, student_id, submited_time, description)
      VALUES ("${assignment_id}", "${user_id}", CURRENT_TIMESTAMP, "${desc}");`;

      console.log(submitQuery);
  
      const data = await Query(submitQuery);
      return data.affectedRows > 0;
    } catch (error) {
      console.log(error.message);
      throw error;
    }

  }

  addScore = async(score,student_id,assignment_id) => {
    try {
      let addScoreQuery = `UPDATE SubmitedAssignmets SET score = "${score}" WHERE assignment_id = "${assignment_id}" AND student_id = "${student_id}";`

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
