import axiosInstance from '../axiosInstance';

export const buyCourse = async (payload) => {
  const { data } = await axiosInstance.post(`/student-courses`, payload);
  return data;
};

export const fetchStudentsCourses = async (studentId) => {
  const { data } = await axiosInstance.get(
    `/student-courses/student/${studentId}/courses`
  );
  return data;
};
