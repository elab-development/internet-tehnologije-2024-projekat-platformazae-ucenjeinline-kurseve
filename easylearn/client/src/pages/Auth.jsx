import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { useAuthContext } from '../context/AuthContext';
import { signInFormControls, signUpFormControls } from '../config';
import CommonForm from '../components/forms/CommonForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useAuthContext();

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const checkSignInFormValid = () => {
    return (
      signInFormData &&
      signInFormData.userEmail !== '' &&
      signInFormData.password !== ''
    );
  };

  const checkSignUpFormValid = () => {
    return (
      signUpFormData &&
      signUpFormData.userName !== '' &&
      signUpFormData.userEmail !== '' &&
      signUpFormData.password !== ''
    );
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-14 flex items-center border-b'>
        <Link to='/' className='flex items-center justify-center'>
          <GraduationCap className='h-8 w-8 mr-4' />
          <span className='font-extrabold text-xl'>Easy Learn</span>
        </Link>
      </header>

      <div className='flex items-center justify-center min-h-screen bg-background'>
        <Tabs
          value={activeTab}
          defaultValue='signin'
          onValueChange={handleTabChange}
          className='w-full max-w-md'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='signin'>Sign In</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value='signin'>
            <Card className='p-6 space-y-4'>
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your courses
                </CardDescription>
                <CardContent className='space-y-2'>
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText='Sign In'
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    buttonDisabled={!checkSignInFormValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value='signup'>
            <Card className='p-6 space-y-4'>
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details and start learning
                </CardDescription>
                <CardContent className='space-y-2'>
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText='Sign Up'
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    buttonDisabled={!checkSignUpFormValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
