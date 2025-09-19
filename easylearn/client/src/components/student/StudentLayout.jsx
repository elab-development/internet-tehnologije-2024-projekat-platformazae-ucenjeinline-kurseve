import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const StudentLayout = () => {
  const location = useLocation();

  return (
    <div>
      {!location.pathname.includes('courses/progress') && <Header />}
      <Outlet />
    </div>
  );
};

export default StudentLayout;
