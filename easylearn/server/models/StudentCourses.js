import mongoose from 'mongoose';

const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
});

const StudentCourse = mongoose.model('StudentCourse', StudentCourseSchema);
export default StudentCourse;
