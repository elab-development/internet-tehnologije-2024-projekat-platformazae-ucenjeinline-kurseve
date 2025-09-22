import CourseProgress from '../models/CourseProgress.model.js';
import Course from '../models/Course.model.js';
import StudentCourses from '../models/StudentCourses.js';

export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.params;

    let progress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lecturesProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lecturesProgress) {
        lecturesProgress.viewed = true;
        lecturesProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Lecture marked as viewed',
      data: progress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentsCourses = await StudentCourses.findOne({ userId });
    const isCoursePurchasedByStudent =
      studentsCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCoursePurchasedByStudent) {
      return res.status(403).json({
        success: true,
        message: 'You do not have access to this course',
        data: {
          isPurchased: false,
        },
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'No progress found',
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found',
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Course progress has been reset',
      data: progress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
