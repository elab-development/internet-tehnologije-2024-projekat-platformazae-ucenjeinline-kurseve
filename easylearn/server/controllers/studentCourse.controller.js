import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import StudentCourse from '../models/StudentCourses.js';

export const addStudentCourse = async (req, res) => {
  try {
    const {
      userId,
      studentName,
      studentEmail,
      courseId,
      title,
      instructorId,
      instructorName,
      courseImage,
    } = req.body;

    let studentCourse = await StudentCourse.findOne({ userId: userId });

    if (studentCourse) {
      const alreadyEnrolled = studentCourse.courses.filter(
        (course) => course.courseId === courseId
      );

      if (alreadyEnrolled.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Already enrolled',
        });
      }

      studentCourse.courses.push({
        courseId: courseId,
        title: title,
        instructorId: instructorId,
        instructorName: instructorName,
        dateOfPurchase: new Date(),
        courseImage: courseImage,
      });
    } else {
      studentCourse = new StudentCourse({
        userId: userId,
        courses: [
          {
            courseId,
            title,
            instructorId,
            instructorName,
            dateOfPurchase: new Date(),
            courseImage,
          },
        ],
      });
    }

    await studentCourse.save();

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId: userId,
          studentName: studentName,
          studentEmail: studentEmail,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'User enrolled the course',
      data: studentCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const getAllStudentsCourses = async (req, res) => {
  try {
    const studentCourses = await StudentCourse.find({});

    return res.status(200).json({
      success: true,
      data: studentCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const getSingleStudentsCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const studentCourses = await StudentCourse.findOne({
      userId: id,
    });

    return res.status(200).json({
      success: true,
      data: studentCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
