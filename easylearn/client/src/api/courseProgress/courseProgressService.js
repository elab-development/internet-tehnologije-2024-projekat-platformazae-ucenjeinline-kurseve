import axiosInstance from '../axiosInstance';

export const markLectureAsViewedService = async (
  userId,
  courseId,
  lectureId
) => {
  const { data } = await axiosInstance.post(
    `/course-progress/student/${userId}/course/${courseId}/lecture/${lectureId}`
  );
  return data;
};

export const getCurrentCourseProgressService = async (userId, courseId) => {
  const { data } = await axiosInstance.get(
    `/course-progress/student/${userId}/course/${courseId}`
  );
  return data;
};

export const resetCurrentCourseProgressService = async (userId, courseId) => {
  const { data } = await axiosInstance.put(
    `/course-progress/student/${userId}/course/${courseId}`
  );
  return data;
};
