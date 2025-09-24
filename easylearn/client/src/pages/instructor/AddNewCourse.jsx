/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

import { useInstructorContext } from '../../context/InstructorContext';
import { useAuthContext } from '../../context/AuthContext';
import {
  addNewCourseService,
  fetchCourseDetailsService,
  updateCourseService,
} from '../../api/courses/courseService';
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from '../../config';
import CourseCurriculum from '../../components/instructor/add-course/CourseCurriculum';
import CourseLanding from '../../components/instructor/add-course/CourseLanding';
import CourseSettings from '../../components/instructor/add-course/CourseSettings';

const AddNewCourse = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useInstructorContext();
  const { auth } = useAuthContext();

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === '' || value === null || value === undefined;
  };

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  };

  const handleCreateUpdateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      title: courseLandingFormData.title,
      category: courseLandingFormData.category,
      level: courseLandingFormData.level,
      primaryLanguage: courseLandingFormData.primaryLanguage,
      subtitle: courseLandingFormData.subtitle,
      description: courseLandingFormData.description,
      pricing: courseLandingFormData.pricing,
      objectives: courseLandingFormData.objectives,
      image: courseLandingFormData.image,
      welcomeMessage: courseLandingFormData.welcomeMessage,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      setLoading(true);
      let res;

      if (currentEditedCourseId) {
        res = await updateCourseService(
          currentEditedCourseId,
          courseFinalFormData
        );
      } else {
        res = await addNewCourseService(courseFinalFormData);
      }

      if (res?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for editting
  useEffect(() => {
    const fetchCurrentCourseDetails = async () => {
      const res = await fetchCourseDetailsService(currentEditedCourseId);
      if (res?.success) {
        const landingFormDataForEditting = Object.keys(
          courseLandingFormData
        ).reduce((acc, key) => {
          acc[key] = res?.data[key] || courseLandingFormData[key];
          return acc;
        }, {});
        setCourseLandingFormData(landingFormDataForEditting);
        setCourseCurriculumFormData(res?.data?.curriculum);
      }
    };

    if (currentEditedCourseId) {
      fetchCurrentCourseDetails();
    }
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params) {
      setCurrentEditedCourseId(params?.courseId);
    }
  }, [params, setCurrentEditedCourseId]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-extrabold mb-5'>
          {currentEditedCourseId ? 'Edit Course' : 'Create a new Course'}
        </h1>
        <Button
          disabled={!validateFormData() || loading}
          className='text-sm tracking-wider font-bold px-8'
          onClick={handleCreateUpdateCourse}
        >
          {loading ? <LoaderCircle /> : 'SUBMIT'}
        </Button>
      </div>
      <div
        onClick={() => {
          navigate(-1);
        }}
        className='flex mb-4 items-center font-bold text-gray-500 cursor-pointer'
      >
        <ChevronLeft size='30' /> Back
      </div>
      <Card>
        <CardContent>
          <div className='container mx-auto p-4'>
            <Tabs defaultValue='curriculum' className='space-y-4'>
              <TabsList>
                <TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
                <TabsTrigger value='course-landing-page'>
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
              </TabsList>
              <TabsContent value='curriculum'>
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value='course-landing-page'>
                <CourseLanding />
              </TabsContent>
              <TabsContent value='settings'>
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCourse;
