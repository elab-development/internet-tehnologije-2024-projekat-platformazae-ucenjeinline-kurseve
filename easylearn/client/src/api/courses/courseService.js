import axiosInstance from '../axiosInstance';

export const fetchAllCoursesService = async () => {
  const { data } = await axiosInstance.get(`/courses`);
  return data;
};

export const fetchCoursesFilteredService = async (query) => {
  const { data } = await axiosInstance.get(`/courses/student?${query}`);
  return data;
};

export const fetchInstructorCourseListService = async (instructorId) => {
  const { data } = await axiosInstance.get(
    `/courses/instructor/${instructorId}`
  );
  return data;
};

export const addNewCourseService = async (formData) => {
  const { data } = await axiosInstance.post(`/courses`, formData);
  return data;
};

export const fetchCourseDetailsService = async (id) => {
  const { data } = await axiosInstance.get(`/courses/${id}`);
  return data;
};

export const updateCourseService = async (id, formData) => {
  const { data } = await axiosInstance.put(`/courses/${id}`, formData);
  return data;
};
