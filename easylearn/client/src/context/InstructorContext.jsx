/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from '../config';

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

export const useInstructorContext = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    console.error('No InstructorContext found!');
  }

  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    instructorCoursesList,
    setInstructorCoursesList,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = context;

  return {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    instructorCoursesList,
    setInstructorCoursesList,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  };
};
