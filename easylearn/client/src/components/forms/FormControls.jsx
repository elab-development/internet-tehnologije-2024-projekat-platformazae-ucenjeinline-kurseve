/* eslint-disable react/prop-types */
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const FormControls = ({ formControls = [], formData, setFormData }) => {
  const renderComponentByType = (controlItem) => {
    let element = null;
    const value = formData[controlItem.name] || '';

    switch (controlItem.componentType) {
      case 'input':
        element = (
          <Input
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
      case 'select':
        element = (
          <Select
            onValueChange={(val) =>
              setFormData({
                ...formData,
                [controlItem.name]: val,
              })
            }
            value={value}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0
                ? controlItem.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case 'textarea':
        element = (
          <Textarea
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
      default:
        element = (
          <Input
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  };

  return (
    <div className='flex flex-col gap-3'>
      {formControls.map((item) => (
        <div key={item.name}>
          <Label htmlFor={item.name}>{item.label}</Label>
          {renderComponentByType(item)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
