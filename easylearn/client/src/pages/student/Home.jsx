import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

import HomeBannerImg from '../../assets/banner.jpg';
import { courseCategories } from '../../config';
import { useStudentContext } from '../../context/StudentContext';
import { fetchAllCoursesService } from '../../api/courses/courseService';

const Home = () => {
  const { studentCoursesList, setStudentCoursesList } = useStudentContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCourses = async () => {
      const res = await fetchAllCoursesService();
      if (res?.success) {
        setStudentCoursesList(res.data);
      }
    };
    fetchAllCourses();
  }, [setStudentCoursesList]);

  const navigateToCourses = (categoryId) => {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      category: [categoryId],
    };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate('/explore');
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <section className='flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8'>
        <div className='lg:w-1/2 lg:pr-12'>
          <h1 className='text-5xl font-bold mb-4'>
            All the skills you need
            <br /> in one place
          </h1>
          <p>
            From critical skills to technical topics, Easy Learn supports your
            professional development.
          </p>
        </div>
        <div className='lg:w-full mb-8 lg:mb-0'>
          <img
            src={HomeBannerImg}
            className='w-full h-auto rounded-lg shadow-lg mt-10 lg:mt-0'
          />
        </div>
      </section>

      <section className='py-8 px-4 lg:px-8 bg-slate-200'>
        <h2 className='text-2xl font-bold mb-6'>Course Categories</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {courseCategories.map((category) => (
            <Button
              key={category.label}
              className='justify-start'
              variant='outline'
              onClick={() => navigateToCourses(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </section>

      <section className='py-12 px-4 lg:px-8 bg-slate-50'>
        <h2 className='text-2xl font-bold mb-6'>Featured Courses</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {studentCoursesList && studentCoursesList.length > 0 ? (
            studentCoursesList.slice(0, 4).map((course) => (
              <div
                onClick={() => navigate(`/courses/${course?._id}`)}
                key={course._id}
                className='bg-white border rounded-lg overflow-hidden shadow cursor-pointer hover:opacity-95'
              >
                <img
                  src={course?.image}
                  width={300}
                  height={150}
                  className='w-full h-60 object-cover'
                />
                <div className='p-4'>
                  <h3 className='font-bold mb-2'>{course?.title}</h3>
                  <div className='flex justify-between items-center'>
                    <p className='text-sm text-gray-700 mb-2'>
                      {course?.instructorName}
                    </p>
                    <p className='font-bold text-[16px]'>${course?.pricing}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No Courses Found</h2>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
