import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

import { useInstructorContext } from '../../../context/InstructorContext';
import { mediaUploadService } from '../../../api/media/mediaService';
import ProgressBar from '../../../components/media/ProgressBar';

const CourseSettings = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructorContext();

  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append('file', selectedImage);

      try {
        setMediaUploadProgress(true);
        const res = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (res.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: res.data.url,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  };

  const handleReplaceImage = async () => {
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {mediaUploadProgress ? (
          <div className='px-2'>
            <ProgressBar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          </div>
        ) : null}
        {courseLandingFormData?.image ? (
          <div className='space-y-6'>
            <img src={courseLandingFormData.image} />
            <Button variant='destructive' onClick={handleReplaceImage}>
              Replace Image
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            <Label>Upload Course Image</Label>
            <Input
              type='file'
              accept='image/*'
              className='mb-4 cursor-pointer'
              onChange={handleImageUpload}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
