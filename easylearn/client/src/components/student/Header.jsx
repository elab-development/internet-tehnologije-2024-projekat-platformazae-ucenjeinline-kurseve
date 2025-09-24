import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, TvMinimalPlay } from 'lucide-react';
import { Button } from '../ui/button';

import { useAuthContext } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials } = useAuthContext();

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  return (
    <header className='flex items-center justify-between p-4 border-b relative'>
      <div className='flex items-center space-x-4'>
        <Link to={'/home'} className='flex items-center'>
          <GraduationCap className='h-8 w-8 mr-4' />
          <span className='font-extrabold md:text-xl text-[14px]'>
            Easy Learn
          </span>
        </Link>

        <div className='flex items-center space-x-1'>
          <Button
            onClick={() => {
              location.pathname.includes('/explore')
                ? null
                : navigate('/explore');
            }}
            variant='ghost'
            className='text-[14px] md:text-[16px] font-medium'
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <div className='flex gap-4 items-center'>
          <div
            className='flex items-center gap-3 cursor-pointer'
            onClick={() => navigate('/my-learning')}
          >
            <span className='text-[14px] md:text-[16px] font-medium'>
              My Learning
            </span>
            <TvMinimalPlay className='w-8 h-8' />
          </div>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
