import express from 'express';
import {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
} from '../controllers/courseProgress.controller.js';

const router = express.Router();

router.post(
  '/student/:userId/course/:courseId/lecture/:lectureId',
  markCurrentLectureAsViewed
);
router.get('/student/:userId/course/:courseId', getCurrentCourseProgress);
router.put('/student/:userId/course/:courseId', resetCurrentCourseProgress);

export default router;
