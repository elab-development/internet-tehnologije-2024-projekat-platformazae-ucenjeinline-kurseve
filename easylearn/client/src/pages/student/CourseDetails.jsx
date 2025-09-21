import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle,
  ChevronRight,
  Globe,
  LoaderCircle,
  Lock,
  PlayCircle,
  Users,
} from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

import { useStudentContext } from '../../context/StudentContext';
import { useAuthContext } from '../../context/AuthContext';
import { fetchCourseDetailsService } from '../../api/courses/courseService';
import { buyCourse } from '../../api/studentCourses/studentCourseService';
import VideoPlayer from '../../components/media/VideoPlayer';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseDetails, setCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [displayFreePreviewVideo, setDisplayFreePreviewVideo] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [bought, setBought] = useState(false);

  const { loading, setLoading } = useStudentContext();
  const { auth } = useAuthContext();

  useEffect(() => {
    const fetchCourseDetails = async (id) => {
      const res = await fetchCourseDetailsService(id);

      if (res?.success) {
        setCourseDetails(res?.data);
      } else {
        setCourseDetails(null);
      }
    };

    if (currentCourseDetailsId !== null) {
      setLoading(true);
      fetchCourseDetails(currentCourseDetailsId);
      setLoading(false);
    }
  }, [currentCourseDetailsId, setCourseDetails, setLoading]);

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id, setCurrentCourseDetailsId]);

  useEffect(() => {
    if (courseDetails) {
      let students = courseDetails.students?.filter(
        (student) => student.studentId === auth?.user?._id
      );

      if (students && students.length > 0) {
        setBought(true);
      }
    }
  }, [courseDetails, auth?.user?._id]);

  useEffect(() => {
    if (displayFreePreviewVideo !== null) setShowFreePreviewDialog(true);
  }, [displayFreePreviewVideo]);

  const getIndexOfFreePreviewLesson =
    courseDetails !== null
      ? courseDetails?.curriculum?.findIndex((item) => item.freePreview)
      : -1;

  const handleBuyNow = async () => {
    const payload = {
      userId: auth?.user?._id,
      studentName: auth?.user?.userName,
      studentEmail: auth?.user?.userEmail,
      courseId: courseDetails?._id,
      title: courseDetails?.title,
      instructorId: courseDetails?.instructorId,
      instructorName: courseDetails?.instructorName,
      courseImage: courseDetails?.image,
    };

    try {
      setBuyLoading(true);
      const res = await buyCourse(payload);

      if (res?.success) {
        setBuyLoading(false);
        navigate(`/courses/progress/${courseDetails?._id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBuyLoading(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className='mx-auto p-4'>
      <div className='flex flex-row mb-4 text-sm gap-2 items-center'>
        <Link to='/home'>Home</Link>
        <ChevronRight className='w-3 h-3' />
        <Link to='/explore'>Explore</Link>
        <ChevronRight className='w-3 h-3' />
        <span>{courseDetails?.title}</span>
      </div>
      <div className='bg-gray-900 text-white p-8 rounded-t-lg'>
        <h1 className='text-3xl font-bold mb-4'>{courseDetails?.title}</h1>
        <p className='text-xl mb-4'>{courseDetails?.subtitle}</p>
        <div className='flex items-center space-x-4 mt-2 text-sm'>
          <span>Created By {courseDetails?.instructorName}</span>
          <span>Created On {courseDetails?.date.split('T')[0]}</span>
          <span className='flex items-center capitalize'>
            <Globe className='mr-1 h-4 w-4' />
            {courseDetails?.primaryLanguage}
          </span>
          <span className='flex items-center capitalize'>
            <Users className='mr-1 h-4 w-4' />
            {courseDetails?.students.length}{' '}
            {courseDetails?.students.length <= 1 ? 'Student' : 'Students'}
          </span>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-8 mt-8'>
        <main className='flex-grow'>
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='text-lg'>What you will learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {courseDetails?.objectives
                  .split('\n')
                  .map((objective, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <div className='w-5 h-5'>
                        <CheckCircle
                          size={20}
                          scale={'contain'}
                          className='mt-1 text-green-500 flex-shrink-0'
                        />
                      </div>
                      <span className='line-clamp-3'>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card className='sticky top-4 mb-8'>
            <CardHeader>
              <CardTitle className='text-lg'>Course Details</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <p className='font-semibold text-sm'>
                {courseDetails?.welcomeMessage}
              </p>
              <p className='text-xs'>{courseDetails?.description}</p>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader className='text-lg'>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {courseDetails?.curriculum?.map((item, index) => (
                  <li
                    key={index}
                    className={`${
                      item?.freePreview
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                    } flex items-center mb-4`}
                    onClick={
                      item?.freePreview
                        ? () => setDisplayFreePreviewVideo(item?.videoUrl)
                        : null
                    }
                  >
                    {item?.freePreview ? (
                      <PlayCircle className='mr-2 h-4 w-4' />
                    ) : (
                      <Lock className='mr-2 h-4 w-4' />
                    )}
                    <span>{item?.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>

        <aside className='w-full md:w-[500px]'>
          <Card className='sticky top-4'>
            <CardContent>
              <div className='aspect-video rounded-lg flex items-center justify-center'>
                <VideoPlayer
                  url={
                    courseDetails?.curriculum[getIndexOfFreePreviewLesson]
                      ?.videoUrl || ''
                  }
                  width='450px'
                  height='200px'
                />
              </div>
              <Button
                disabled={buyLoading || bought}
                className='w-full disabled:bg-green-700'
                onClick={handleBuyNow}
              >
                {buyLoading ? (
                  <LoaderCircle />
                ) : bought ? (
                  'Already Enrolled'
                ) : (
                  `Buy Now $${courseDetails?.pricing}`
                )}
              </Button>
              {bought && (
                <Button
                  className='w-full mt-2'
                  onClick={() =>
                    navigate(`/courses/progress/${courseDetails?._id}`)
                  }
                >
                  Start Learning
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayFreePreviewVideo(null);
        }}
      >
        <DialogContent className='w-[800px]'>
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className='aspect-video rounded-lg flex items-center justify-center'>
            <VideoPlayer
              url={displayFreePreviewVideo}
              width='450px'
              height='200px'
            />
          </div>
          <div className='flex flex-col gap-2'>
            {courseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setDisplayFreePreviewVideo(filteredItem?.videoUrl);
                  }}
                  className='cursor-pointer text-[16px] font-medium'
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;
