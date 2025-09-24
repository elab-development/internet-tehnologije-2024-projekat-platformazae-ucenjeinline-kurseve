import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';

import { useInstructorContext } from '../../../context/InstructorContext';
import { courseCurriculumInitialFormData } from '../../../config';
import {
  mediaDeleteService,
  mediaUploadService,
} from '../../../api/media/mediaService';
import ProgressBar from '../../../components/media/ProgressBar';
import VideoPlayer from '../../../components/media/VideoPlayer';

const CourseCurriculum = () => {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructorContext();

  const handleAddNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  const handleChangeTitle = (e, index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    courseCurriculumFormDataCopy[index] = {
      ...courseCurriculumFormDataCopy[index],
      title: e.target.value,
    };
    setCourseCurriculumFormData(courseCurriculumFormDataCopy);
  };

  const handleFreePreviewChange = (value, index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    courseCurriculumFormDataCopy[index] = {
      ...courseCurriculumFormDataCopy[index],
      freePreview: value,
    };
    setCourseCurriculumFormData(courseCurriculumFormDataCopy);
  };

  const handleVideoUpload = async (e, index) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append('file', selectedFile);

      try {
        setMediaUploadProgress(true);
        const res = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (res.success) {
          let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
          courseCurriculumFormDataCopy[index] = {
            ...courseCurriculumFormDataCopy[index],
            videoUrl: res?.data?.url,
            public_id: res?.data?.public_id,
          };
          setCourseCurriculumFormData(courseCurriculumFormDataCopy);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  };

  const handleChangeAdditionalTitle = (e, index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    let additionalFormDataCopy = courseCurriculumFormDataCopy[index].additional;
    courseCurriculumFormDataCopy[index] = {
      ...courseCurriculumFormDataCopy[index],
      additional: {
        ...additionalFormDataCopy,
        title: e.target.value,
      },
    };
    setCourseCurriculumFormData(courseCurriculumFormDataCopy);
  };

  const handleChangeAdditionalURL = async (e, index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    let additionalFormDataCopy = courseCurriculumFormDataCopy[index].additional;
    courseCurriculumFormDataCopy[index] = {
      ...courseCurriculumFormDataCopy[index],
      additional: {
        ...additionalFormDataCopy,
        url: e.target.value,
      },
    };
    setCourseCurriculumFormData(courseCurriculumFormDataCopy);
  };

  const isCurriculumFormDataValid = () => {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === 'object' &&
        item.title.trim() !== '' &&
        item.videoUrl.trim() !== ''
      );
    });
  };

  const handleReplaceVideo = async (index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    const publicId = courseCurriculumFormDataCopy[index].public_id;
    const res = await mediaDeleteService(publicId);
    if (res?.success) {
      courseCurriculumFormDataCopy[index] = {
        ...courseCurriculumFormDataCopy[index],
        videoUrl: '',
        public_id: '',
      };
      setCourseCurriculumFormData(courseCurriculumFormDataCopy);
    }
  };

  const handleDeleteLecture = async (index) => {
    let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
    const publicId = courseCurriculumFormDataCopy[index].public_id;
    const res = await mediaDeleteService(publicId);
    if (res?.success) {
      courseCurriculumFormDataCopy = courseCurriculumFormDataCopy.filter(
        (_, i) => i !== index
      );
      setCourseCurriculumFormData(courseCurriculumFormDataCopy);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleAddNewLecture}
          disabled={!isCurriculumFormDataValid() || mediaUploadProgress}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <ProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className='mt-4 space-y-4'>
          {courseCurriculumFormData.map((_, index) => (
            <div key={index} className='border p-5 rounded-md'>
              <div className='flex gap-5 items-center'>
                <h3 className='font-semibold'>Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  type='text'
                  placeholder='Enter lecture title'
                  className='max-w-96'
                  value={courseCurriculumFormData[index]?.title}
                  onChange={(e) => handleChangeTitle(e, index)}
                />
                <div className='flex items-center space-x-2'>
                  <Switch
                    id={`freePreview-${index + 1}`}
                    checked={courseCurriculumFormData[index]?.freePreview}
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className='mt-6'>
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className='flex gap-3'>
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width='450px'
                      height='200px'
                    />
                    <Button
                      variant='ghost'
                      onClick={() => handleReplaceVideo(index)}
                    >
                      Replace Video
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={() => handleDeleteLecture(index)}
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type='file'
                    accept='video/*'
                    className='mb-4'
                    onChange={(e) => handleVideoUpload(e, index)}
                  />
                )}
              </div>
              <Card className='mt-2'>
                <CardHeader>
                  <CardTitle>Additional Materials</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                  <Input
                    name={`material-title-${index + 1}`}
                    type='text'
                    placeholder='Enter material title'
                    className='w-full'
                    value={courseCurriculumFormData[index]?.additional?.title}
                    onChange={(e) => handleChangeAdditionalTitle(e, index)}
                  />
                  <Input
                    name={`material-url-${index + 1}`}
                    type='text'
                    placeholder='Enter material URL'
                    className='w-full'
                    value={courseCurriculumFormData[index]?.additional?.url}
                    onChange={(e) => handleChangeAdditionalURL(e, index)}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
