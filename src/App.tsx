import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import HomePage from './pages/HomePage'
import { Toaster } from "sonner"
import VerifyOTPPage from './pages/auth/VerifyOTPPage'

// 1. Đảm bảo đã import đúng đường dẫn
import { ModalProvider } from './components/GlobalModal/ModalContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Header } from './components/Header'
import Footer from './components/Footer'
import CourseList from './pages/CoureListPage'
import ForbiddenPage from './pages/ForbiddentPage'
function App() {

  return (
    <>


      <Toaster richColors position="top-center" />

      <BrowserRouter>
        {/* 2. Bọc ModalProvider ở đây. 
            Nó nằm trong BrowserRouter để sau này nếu Modal cần điều hướng (navigate) 
            thì vẫn hoạt động tốt. 
        */}
        <ModalProvider>
          <Header />

          <Routes>

            {/* public routes */}
            <Route path="/" element={<HomePage />} />

            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/verify-otp' element={<VerifyOTPPage />} />

            <Route path="/courses" element={<CourseList />} />

            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* protectect routes */}
            <Route element={<ProtectedRoute />}>


            </Route>

          </Routes>

          <Footer />
        </ModalProvider>
      </BrowserRouter>

    </>
  )
}

export default App