import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

import { useInstructorContext } from '../../../context/InstructorContext';
import { courseLandingPageFormControls } from '../../../config';
import FormControls from '../../../components/forms/FormControls';

const CourseLanding = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useInstructorContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
};

export default CourseLanding;
