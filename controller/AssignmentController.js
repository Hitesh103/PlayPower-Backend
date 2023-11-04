import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utills/sendMails.js";

import upload from "../config/multerConfig.js";
import {
  Assignment,
  Attachment,
  AssignmentStudentTag,
  User,
} from "../model/index.js";

class AssignmentController {
  constructor() {
    this.assignment = new Assignment();
    this.attachment = new Attachment();
    this.assignmentStudentTag = new AssignmentStudentTag();
    this.user = new User();
  }

  create = async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.log("Error in uploading Assignment files - Controller");
          console.log(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error in uploading Attachments",
            data: {},
            success: false,
            error: err.message,
          });
        }

        let teacherData = await this.user.findById(req.user_id);
        if (teacherData.role == "0") {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: "You do not have permission to create the Assignment",
            data: {},
            success: false,
          });
        }

        // console.log(req.file);
        // console.log("-------------->",req);
        let attachment_data = req.file.filename;
        // let attachment_data = "123.pdf";

        let attachment_id = uuidv4();
        let response = await this.attachment.create(
          attachment_id,
          attachment_data
        );

        let assignment_id = uuidv4();
        const AssignmentData = {
          assignment_id: assignment_id,
          description: req.body.description,
          published_at: req.body.published_at,
          due_date: req.body.due_date,
          user_id: req.user_id,
          attachment_id: attachment_id,
          subject: req.body.subject,
        };

        let taggedStudent = req.body.taggedStudent;

        const newAssignment = await this.assignment.create(AssignmentData);
        const data = await this.assignmentStudentTag.create(
          assignment_id,
          taggedStudent
        );

        const taggedStudents = req.body.taggedStudent;
        
        for (let i = 0; i < taggedStudents.length; i++) {
          try {
            const element = await this.user.findById(taggedStudents[i]);
            console.log(element);
            const eMail = element[0].email;
            await sendEmail(eMail, "Assignment", "New Assignment is assigned to you. Please check your dashboard for more details.");
          } catch (error) {
            console.error("Error while fetching user data:", error);
          }
        }
        
        return res.status(StatusCodes.OK).json({
          message: "Assignment Created Successfully",
          data: newAssignment,
          success: true,
        });
      });
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  };

  update = async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.log("Error in uploading Assignment files - Controller");
          console.log(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error in uploading Attachments",
            data: {},
            success: false,
            error: err.message,
          });
        }
        const assignment_id = req.params.id;
        const existingAssignment = await this.assignment.findById(assignment_id);

        if (!existingAssignment) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Assignment not Found",
            data: {},
            success: false,
          });
        }

        if (existingAssignment[0].user_id !== req.user_id) {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: "You do not have permission to update this Assignment",
            data: {},
            success: false,
          });
        }

        let updatedAssignmentData = {};
        if (req.body.description) {
          updatedAssignmentData.description = req.body.description;
        }

        if (req.body.published_at) {
          updatedAssignmentData.published_at = req.body.published_at;
        }

        if (req.body.due_date) {
            updatedAssignmentData.due_date = req.body.due_date;
          }

        if (req.body.taggedStudent) {
          await this.assignmentStudentTag.updateTaggedStudents(
            assignment_id,
            req.body.taggedStudent
          );
        }

        if (req.body.type) {
          let type = req.body.type;
          let attachment_data = req.file.filename;
          if (attachment_data) {
            const updateAttachment = await this.attachment.update(
              existingAssignment[0].attachment_id,
              attachment_data,
              type
            );
          }
        }

        if (Object.keys(updatedAssignmentData).length != 0) {
          const updatedAssignment = await this.assignment.update(
            assignment_id,
            updatedAssignmentData
          );
        }

        return res.status(StatusCodes.OK).json({
          message: "Assignment updated Successfully",
          success: true,
        });
      });
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  };

  delete = async (req, res) => {
    try {
      const assignment_id = req.body.id,
        user_id = req.user_id;

      const deleteAssignment = await this.assignment.delete(assignment_id, user_id);

      if (deleteAssignment == true) {
        return res.status(StatusCodes.OK).json({
          message: "Assignment Deleted Successfully",
          data: deleteAssignment,
          success: true,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Assignment not found with this User",
          data: deleteAssignment,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  };


  Submit = async (req,res) => {
    try {

      const assignment_id = req.body.id;
      const user_id = req.user_id;
      const desc = req.body.description;

      const submitAssignment = await this.assignment.submit(assignment_id,user_id,desc);

      if (submitAssignment == true) {
        return res.status(StatusCodes.OK).json({
          message: "Assignment Submitted Successfully",
          data: submitAssignment,
          success: true,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Assignment not found",
          data: submitAssignment,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  }

  addScore = async (req,res) => {
    try {
      const assignment_id = req.body.assignment_id;
      const score = req.body.score;
      const userID = req.body.user_id;
      const student_id = req.body.student_id;
      const user_id = req.user_id;

      
      if(userID != user_id){
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "You do not have permission to add the score",
          data: {},
          success: false,
        });
      }

      // Add the Score
      const addScore = await this.assignment.addScore(score,student_id,assignment_id);

      if (addScore == true) {
        return res.status(StatusCodes.OK).json({
          message: "Score Updated Successfully",
          data: addScore,
          success: true,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Assignment not found",
          data: addScore,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        data: {},
        success: false,
        err: error,
      });
    }
  }
}

export default AssignmentController;
