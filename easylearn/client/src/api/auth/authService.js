import axiosInstance from '../axiosInstance';

export const registerService = async (formData) => {
  try {
    const { data } = await axiosInstance.post('/auth/register', {
      ...formData,
      role: 'user',
    });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const loginService = async (formData) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', formData);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const checkAuthService = async () => {
  const { data } = await axiosInstance.get('/auth/check-auth');
  return data;
};

export const fetchAllUsersService = async () => {
  const { data } = await axiosInstance.get('/auth/users');
  return data;
};
