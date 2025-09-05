import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from './context/AuthContext';
import AdminProvider from './context/AdminContext';
import InstructorProvider from './context/InstructorContext';
import StudentProvider from './context/StudentContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <InstructorProvider>
          <StudentProvider>
            <App />
          </StudentProvider>
        </InstructorProvider>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>
);
