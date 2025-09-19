import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import mediaRoutes from './routes/media.routes.js';
import courseRoutes from './routes/course.routes.js';
import studentCoursesRoutes from './routes/studentCourse.routes.js';
import courseProgressRoutes from './routes/courseProgress.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const PORT = process.env.PORT || 5000;

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.log('Error connecting to MongoDB: ' + e));

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student-courses', studentCoursesRoutes);
app.use('/api/course-progress', courseProgressRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

// Starting the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
