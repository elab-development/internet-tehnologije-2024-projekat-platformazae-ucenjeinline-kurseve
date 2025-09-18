import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useAuthContext } from './context/AuthContext';
import RouteGuard from './components/auth/RouteGuard';
import StudentLayout from './components/student/StudentLayout';
import AuthPage from './pages/Auth';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AddNewCourse from './pages/instructor/AddNewCourse';
import Home from './pages/student/Home';
import ExploreCourses from './pages/student/ExploreCourses';
import CourseDetails from './pages/student/CourseDetails';
import MyLearning from './pages/student/MyLearning';
import CourseProgress from './pages/student/CourseProgress';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const { auth } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/auth'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<AuthPage />}
            />
          }
        />

        <Route
          path='/instructor'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<InstructorDashboard />}
            />
          }
        />
        <Route
          path='/instructor/create'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<AddNewCourse />}
            />
          }
        />
        <Route
          path='/instructor/edit/:courseId'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<AddNewCourse />}
            />
          }
        />

        <Route
          path='/'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<StudentLayout />}
            />
          }
        >
          <Route path='' element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route path='explore' element={<ExploreCourses />} />
          <Route path='courses/progress/:id' element={<CourseProgress />} />
          <Route path='courses/:id' element={<CourseDetails />} />
          <Route path='my-learning' element={<MyLearning />} />
        </Route>

        <Route
          path='/admin'
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              user={auth.user}
              element={<AdminDashboard />}
            />
          }
        />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
