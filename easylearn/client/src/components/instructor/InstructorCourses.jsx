/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { useInstructorContext } from '../../context/InstructorContext';
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from '../../config';

const InstructorCourses = ({ listOfCourses }) => {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useInstructorContext();

  return (
    <Card>
      <CardHeader className='flex justify-between flex-row items-center'>
        <CardTitle className='text-3xl font-extrabold'>All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate('/instructor/create');
          }}
          className='p-6'
        >
          Create new Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className='font-medium'>
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>
                        ${course?.students?.length * course?.pricing}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit/${course?._id}`);
                          }}
                          variant='ghost'
                          size='sm'
                        >
                          <Edit className='h-6 w-6' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
