import express from 'express';
import {
  addStudentCourse,
  getAllStudentsCourses,
  getSingleStudentsCourses,
} from '../controllers/studentCourse.controller.js';

const router = express.Router();

router.post('/', addStudentCourse);
router.get('/', getAllStudentsCourses);
router.get('/student/:id/courses', getSingleStudentsCourses);

export default router;
