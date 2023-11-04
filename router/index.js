import { Router } from "express";
import { authMiddleware, Validator } from "../middleware/index.js";
import { AuthController, AssignmentController, FeedController } from "../controller/index.js";

const router = Router();

const authController = new AuthController();
const assignmentController = new AssignmentController();
const feedController = new FeedController();

var validator = new Validator();

// Auth Route
router.post('/auth', validator.authValidator, authController.Auth);

// Assignment Routes
router.post('/assignment/create', authMiddleware, assignmentController.create);
router.put('/assignment/update/:id',authMiddleware,assignmentController.update);
router.delete('/assignment/delete',authMiddleware,assignmentController.delete);

// feed Routes
router.get("/feed/student/:id", authMiddleware, feedController.StudentFeed);
router.get("/feed/teacher/:id", authMiddleware, feedController.TeacherFeed);

// Submit the Assignment Route
router.get("/assignment/submit/:id",authMiddleware,assignmentController.Submit);

// Add Sccore Route
router.post("/assignment/addscore",authMiddleware,assignmentController.addScore);

export default router;