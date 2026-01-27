import { BrowserRouter, Route, Routes } from 'react-router'; // hoặc 'react-router-dom'
import MainLayout from './layouts/MainLayout'; // Import layout vừa tạo
import { ModalProvider } from './components/GlobalModal/ModalContext';
import { Toaster } from 'sonner';
import CourseList from './pages/course/CoureListPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';
import ForbiddenPage from './pages/other/ForbiddentPage';
import NotFoundPage from './pages/other/NotFoundPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import StudentManagePage from './pages/admin/StudentManagePage';

// ... các import khác giữ nguyên ...

function App() {
  return (
    <>
      <Toaster richColors position="top-center" offset="70px" />

      <BrowserRouter>
        <ModalProvider>

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseList />} />

              <Route element={<ProtectedRoute />}>
              </Route>
            </Route>

            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/verify-otp' element={<VerifyOTPPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              
              <Route path="/admin" element={<AdminLayout />}>
                {/* Dùng 'index' để khi vào /admin tự động hiện dashboard */}
                <Route index element={<DashboardPage />} /> 
                
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="students" element={<StudentManagePage/>} />
                <Route path="teachers" element={<div>Trang Lecturer</div>} />
                <Route path="courses" element={<div>Trang Khóa học</div>} />
              </Route>

            </Route>

          </Routes>

        </ModalProvider>
      </BrowserRouter>
    </>
  )
}

export default App