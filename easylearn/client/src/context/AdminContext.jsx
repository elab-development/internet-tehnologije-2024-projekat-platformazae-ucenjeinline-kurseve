/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

export const AdminContext = createContext(null);

export default function AdminProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  return (
    <AdminContext.Provider
      value={{ allUsers, setAllUsers, allCourses, setAllCourses }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    console.error('No AdminContext found!');
  }

  const { allUsers, setAllUsers, allCourses, setAllCourses } = context;
  return { allUsers, setAllUsers, allCourses, setAllCourses };
};
