import { useEffect, useState } from 'react';
import { BarChart, Book, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent } from '../../components/ui/tabs';

import { useAuthContext } from '../../context/AuthContext';
import { useInstructorContext } from '../../context/InstructorContext';
import { fetchInstructorCourseListService } from '../../api/courses/courseService';
import InstructorDashboardView from '../../components/instructor/InstructorDashboardView';
import InstructorCourses from '../../components/instructor/InstructorCourses';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { auth, resetCredentials } = useAuthContext();
  const { instructorCoursesList, setInstructorCoursesList } =
    useInstructorContext();

  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: (
        <InstructorDashboardView listOfCourses={instructorCoursesList} />
      ),
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null,
    },
  ];

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await fetchInstructorCourseListService(auth?.user?._id);

        if (res?.success) {
          setInstructorCoursesList(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllCourses();
  }, [auth, setInstructorCoursesList]);

  return (
    <div className='flex h-full min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block'>
        <div className='p-4'>
          <h2 className='text-2xl font-bold mb-4'>Instructor</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className='w-full justify-start mb-2'
                key={menuItem.value}
                variant={activeTab === menuItem.value ? 'secondary' : 'ghost'}
                onClick={
                  menuItem.value === 'logout'
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className='mr-2 h-4 w-4' />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
