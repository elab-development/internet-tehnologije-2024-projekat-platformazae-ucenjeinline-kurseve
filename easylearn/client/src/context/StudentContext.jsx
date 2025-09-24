/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCoursesList, setStudentCoursesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsBoughtCoursesList, setStudentsBoughtCoursesList] = useState(
    []
  );
  const [studentCourseProgress, setStudentCourseProgress] = useState({});

  return (
    <StudentContext.Provider
      value={{
        studentCoursesList,
        setStudentCoursesList,
        loading,
        setLoading,
        studentsBoughtCoursesList,
        setStudentsBoughtCoursesList,
        studentCourseProgress,
        setStudentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    console.error('No StudentContext found!');
  }

  const {
    studentCoursesList,
    setStudentCoursesList,
    loading,
    setLoading,
    studentsBoughtCoursesList,
    setStudentsBoughtCoursesList,
    studentCourseProgress,
    setStudentCourseProgress,
  } = context;

  return {
    studentCoursesList,
    setStudentCoursesList,
    loading,
    setLoading,
    studentsBoughtCoursesList,
    setStudentsBoughtCoursesList,
    studentCourseProgress,
    setStudentCourseProgress,
  };
};
