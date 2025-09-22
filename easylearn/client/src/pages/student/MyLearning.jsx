import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, TvMinimalPlay } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

import { useStudentContext } from '../../context/StudentContext';
import { useAuthContext } from '../../context/AuthContext';
import { fetchStudentsCourses } from '../../api/studentCourses/studentCourseService';

const MyLearning = () => {
  const navigate = useNavigate();

  const {
    loading,
    setLoading,
    studentsBoughtCoursesList,
    setStudentsBoughtCoursesList,
  } = useStudentContext();
  const { auth } = useAuthContext();

  useEffect(() => {
    const fetchBoughtCourses = async () => {
      try {
        setLoading(true);
        const res = await fetchStudentsCourses(auth?.user?._id);

        if (res?.success) {
          setStudentsBoughtCoursesList(res?.data?.courses);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtCourses();
  }, [auth?.user?._id, setLoading, setStudentsBoughtCoursesList]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className='p-4'>
      <div className='flex flex-row mb-4 text-sm gap-2 items-center'>
        <Link to='/home'>Home</Link>
        <ChevronRight className='w-3 h-3' />
        <Link to='/my-learning'>My Learning</Link>
      </div>
      <h1 className='text-3xl font-bold mb-8'>My Learning</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {studentsBoughtCoursesList && studentsBoughtCoursesList.length > 0 ? (
          studentsBoughtCoursesList.map((course) => (
            <Card key={course?.courseId} className='flex flex-col'>
              <CardContent className='p-4 flex-grow'>
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className='h-52 w-full object-cover rounded-md mb-4'
                />
                <h3 className='font-bold mb-1'>{course?.title}</h3>
                <p className='text-sm text-gray-700 mb-2'>
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className='flex-1 flex items-center gap-4'
                  onClick={() =>
                    navigate(`/courses/progress/${course?.courseId}`)
                  }
                >
                  <TvMinimalPlay className='h-4 w-4' />
                  <span>Start Learning</span>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h2 className='text-2xl font-bold'>
            You have not enrolled any courses yet!
          </h2>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
