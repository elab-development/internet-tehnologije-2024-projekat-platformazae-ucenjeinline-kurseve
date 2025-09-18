/* eslint-disable react/prop-types */
import { Button } from '../ui/button';
import FormControls from './FormControls';

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  buttonDisabled = false,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button type='submit' className='mt-5 w-full' disabled={buttonDisabled}>
        {buttonText || 'Submit'}
      </Button>
    </form>
  );
};

export default CommonForm;
