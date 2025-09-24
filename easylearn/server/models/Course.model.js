import mongoose from 'mongoose';

const AdditionalMaterials = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  freePreview: {
    type: Boolean,
    default: false,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  additional: AdditionalMaterials,
});

const CourseSchema = new mongoose.Schema({
  instructorId: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  level: {
    type: String,
  },
  primaryLanguage: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
  pricing: {
    type: Number,
  },
  objectives: {
    type: String,
  },
  image: {
    type: String,
  },
  welcomeMessage: {
    type: String,
  },
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublished: {
    type: Boolean,
    default: false,
  },
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
