/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Confetti from 'react-confetti';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';

import { useAuthContext } from '../../context/AuthContext';
import { useStudentContext } from '../../context/StudentContext';
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCurrentCourseProgressService,
} from '../../api/courseProgress/courseProgressService';
import VideoPlayer from '../../components/media/VideoPlayer';
import YoutubeVideos from '../../components/media/YoutubeVideos';

const CourseProgress = () => {
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const { auth } = useAuthContext();
  const {
    loading,
    setLoading,
    studentCourseProgress,
    setStudentCourseProgress,
  } = useStudentContext();

  const fetchCurrentCourseProgress = async () => {
    try {
      setLoading(true);
      const res = await getCurrentCourseProgressService(auth?.user?._id, id);

      if (res?.success) {
        if (!res?.data?.isPurchased) {
          setLockCourse(true);
        } else {
          setStudentCourseProgress({
            courseDetails: res?.data?.courseDetails,
            progress: res?.data?.progress,
          });

          if (res?.data?.completed) {
            setCurrentLecture(res?.data?.courseDetails?.curriculum[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
            return;
          }

          if (res?.data?.progress?.length === 0) {
            setCurrentLecture(res?.data?.courseDetails?.curriculum[0]);
          } else {
            const lastIndexOfViewed = res?.data?.progress.reduceRight(
              (acc, obj, index) => {
                return acc === -1 && obj.viewed ? index : acc;
              },
              -1
            );

            setCurrentLecture(
              res?.data?.courseDetails?.curriculum[lastIndexOfViewed + 1]
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markLectureAsViewed = async () => {
    try {
      if (currentLecture) {
        const res = await markLectureAsViewedService(
          auth?.user?._id,
          id,
          currentLecture?._id
        );

        if (res?.success) {
          await fetchCurrentCourseProgress();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRewatch = async () => {
    try {
      if (currentLecture) {
        const res = await resetCurrentCourseProgressService(
          auth?.user?._id,
          id
        );

        if (res?.success) {
          setCurrentLecture(null);
          setShowConfetti(false);
          setShowCourseCompleteDialog(false);
          await fetchCurrentCourseProgress();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 10000);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      markLectureAsViewed();
    }
  }, [currentLecture]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className='flex flex-col h-screen bg-[#1c1d1f] text-white'>
      {showConfetti && <Confetti />}
      <div className='flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700'>
        <div className='flex items-center space-x-4'>
          <Button
            onClick={() => navigate('/my-learning')}
            className='text-white'
            variant='ghost'
            size='sm'
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Back to My Learning
          </Button>
          <h1 className='text-lg font-bold hidden md:block'>
            {studentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <ChevronRight className='h-5 w-5' />
          ) : (
            <ChevronLeft className='h-5 w-5' />
          )}
        </Button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div
          className={`flex-1 ${
            sidebarOpen ? ' mr-[400px]' : ''
          } transition-all duration-300`}
        >
          <VideoPlayer
            width='100%'
            height='500px'
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className='p-6 bg-[#1c1d1f]'>
            <h2 className='text-2xl font-bold mb-2'>{currentLecture?.title}</h2>
          </div>

          {currentLecture && (
            <YoutubeVideos
              query={`${
                studentCourseProgress?.courseDetails?.title +
                ' ' +
                currentLecture?.title
              }`}
            />
          )}
        </div>

        <div
          className={`fixed top-[69px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Tabs defaultValue='content' className='h-full flex flex-col'>
            <TabsList className='grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14'>
              <TabsTrigger value='content' className='rounded-none h-full'>
                Course Content
              </TabsTrigger>
              <TabsTrigger value='overview' className='rounded-none h-full'>
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value='content'>
              <ScrollArea className='h-full'>
                <div className='p-4 space-y-4'>
                  {studentCourseProgress?.courseDetails?.curriculum?.map(
                    (item) => (
                      <div
                        key={item._id}
                        className='flex items-center space-x-2 text-sm text-white font-bold cursor-pointer'
                      >
                        {studentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className='h-4 w-4 text-green-500' />
                        ) : (
                          <Play className='h-4 w-4' />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}

                  {currentLecture?.additional?.title &&
                    currentLecture?.additional?.url && (
                      <div className='pt-6'>
                        <h3 className='font-bold'>Additional Materials</h3>
                        <a
                          target='_blank'
                          className='underline text-sm'
                          href={currentLecture?.additional?.url}
                        >
                          {currentLecture?.additional?.title}
                        </a>
                      </div>
                    )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value='overview' className='flex-1 overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='flex flex-col p-4 gap-2'>
                  <p className='text-sm font-bold'>
                    {studentCourseProgress?.courseDetails?.welcomeMessage}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {studentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value='overview'></TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={lockCourse}>
        <DialogContent className='sm:w-[425px]'>
          <DialogHeader>
            <DialogTitle>You can not access this course!</DialogTitle>
            <DialogDescription>
              Please purhcase this course to gain access.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className='sm:w-[425px]'>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className='flex flex-col gap-3'>
              <Label>You have completed the course!</Label>
              <div className='flex flex-row gap-3'>
                <Button onClick={() => navigate('/my-learning')}>
                  My Learning
                </Button>
                <Button onClick={handleRewatch}>Rewatch</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseProgress;
