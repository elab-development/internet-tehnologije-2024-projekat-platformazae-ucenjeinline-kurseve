import axiosInstance from '../axiosInstance';

export const mediaUploadService = async (formData, onProgressCallback) => {
  const { data } = await axiosInstance.post('/media/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
};

export const mediaDeleteService = async (id) => {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);
  return data;
};
