import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getCoursesFiltered,
  getInstructorCourses,
  updateCourse,
} from '../controllers/course.controller.js';

const router = express.Router();

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/student', getCoursesFiltered);
router.get('/instructor/:id', getInstructorCourses);
router.get('/:id', getCourseDetails);
router.put('/:id', updateCourse);

export default router;
