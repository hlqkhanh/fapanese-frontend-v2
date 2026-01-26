import { BrowserRouter, Route, Routes } from 'react-router'; // hoặc 'react-router-dom'
import MainLayout from './layouts/MainLayout'; // Import layout vừa tạo
import { ModalProvider } from './components/GlobalModal/ModalContext';
import { Toaster } from 'sonner';
import HomePage from './pages/admin/AdminPage';
import CourseList from './pages/course/CoureListPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';
import ForbiddenPage from './pages/other/ForbiddentPage';
import NotFoundPage from './pages/other/NotFoundPage';
import AdminPage from './pages/admin/AdminPage';

// ... các import khác giữ nguyên ...

function App() {
  return (
    <>
      <Toaster richColors position="top-center" offset="70px" />

      <BrowserRouter>
        <ModalProvider>
          {/* Xóa Header và Footer ở đây đi, vì nó đã nằm trong MainLayout */}

          <Routes>
            {/* --- NHÓM 1: CÁC TRANG CÓ HEADER & FOOTER --- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseList />} />
              
              {/* Protected Routes cũng cần Header thì nhét vào đây */}
              <Route element={<ProtectedRoute />}>
                 {/* Ví dụ: <Route path="/profile" element={<ProfilePage />} /> */}
              </Route>
            </Route>

            {/* --- NHÓM 2: CÁC TRANG KHÔNG CÓ HEADER/FOOTER (FULL SCREEN) --- */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/verify-otp' element={<VerifyOTPPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/admin" element={<AdminPage />} />

          </Routes>

        </ModalProvider>
      </BrowserRouter>
    </>
  )
}

export default App