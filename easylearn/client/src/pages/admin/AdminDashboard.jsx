import { useEffect, useState } from 'react';
import { Book, LogOut, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent } from '../../components/ui/tabs';

import { useAuthContext } from '../../context/AuthContext';
import { useAdminContext } from '../../context/AdminContext';
import { fetchAllCoursesService } from '../../api/courses/courseService';
import { fetchAllUsersService } from '../../api/auth/authService';
import AdminUsers from '../../components/admin/AdminUsers';
import AdminCourses from '../../components/admin/AdminCourses';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { auth, resetCredentials } = useAuthContext();
  const { allUsers, setAllUsers, allCourses, setAllCourses } =
    useAdminContext();

  const menuItems = [
    {
      icon: Users,
      label: 'Users',
      value: 'users',
      component: <AdminUsers allUsers={allUsers} />,
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <AdminCourses allCourses={allCourses} />,
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
    const fetchAllUsers = async () => {
      try {
        const res = await fetchAllUsersService();

        if (res?.success) {
          setAllUsers(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllCourses = async () => {
      try {
        const res = await fetchAllCoursesService();

        if (res?.success) {
          setAllCourses(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
    fetchAllCourses();
  }, [auth, setAllCourses, setAllUsers]);

  return (
    <div className='flex h-full min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block'>
        <div className='p-4'>
          <h2 className='text-2xl font-bold mb-4'>Admin</h2>
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

export default AdminDashboard;
