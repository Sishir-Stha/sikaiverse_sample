import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatbotProvider } from './context/ChatbotContext'
import { Toaster } from 'sonner'
import LandingPage from './pages/Landing/LandingPage'
import LoginPage from './pages/Login/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import StudentDashboard from './pages/StudentDashboard/StudentDashboard'
import CoursesPage from './pages/Courses/CoursesPage'
import CourseDetailPage from './pages/Courses/CourseDetailPage'
import CourseLearnPage from './pages/Courses/CourseLearnPage'
import ModuleDetailPage from './pages/Courses/ModuleDetailPage'
import LessonViewPage from './pages/Courses/LessonViewPage'
import BrowseCoursesPage from './pages/Courses/BrowseCoursesPage'
import DiscussionForumPage from './pages/Courses/DiscussionForumPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminDiscussionsPage from './pages/Admin/AdminDiscussionsPage'
import AdminCoursesPage from './pages/Admin/AdminCoursesPage'
import AdminCourseEditPage from './pages/Admin/AdminCourseEditPage'
import AdminCoursesCreate from './pages/Admin/CoursesCreate'
import AdminModulesCreate from './pages/Admin/ModulesCreate'
import AdminLessonsCreate from './pages/Admin/LessonsCreate'
import UsersPage from './pages/Admin/UsersPage'
import InstructorDashboard from './pages/Instructor/InstructorDashboard'
import ProfilePage from './pages/Profile/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Chatbot from './components/Chatbot'

function AppLayout() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  
  // Show sidebar on protected routes (not on landing, login, browse, course-details, or learn pages)
  const showSidebar = isAuthenticated && !['/login', '/', '/browse'].includes(location.pathname) && !location.pathname.startsWith('/course-details') && !location.pathname.includes('/learn')

  // Handle redirect if user lands on generic '/' but is logged in
  if (isAuthenticated && location.pathname === '/') {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'instructor') return <Navigate to="/instructor" replace />
    return <Navigate to="/dashboard" replace />
  }

  // Show chatbot only on index and explore pages
  const showChatbot = location.pathname === '/' || location.pathname === '/browse'

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowseCoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/learn" element={<CourseLearnPage />} />
          <Route path="/course-details/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/forum" element={<ProtectedRoute><DiscussionForumPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/modules/:moduleId" element={<ProtectedRoute><ModuleDetailPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonId" element={<ProtectedRoute><LessonViewPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/courses/:courseId/edit" element={<ProtectedRoute requiredRole="admin"><AdminCourseEditPage /></ProtectedRoute>} />
          <Route path="/admin/discussions" element={<ProtectedRoute requiredRole="admin"><AdminDiscussionsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/courses/create" element={<ProtectedRoute requiredRole="admin"><AdminCoursesCreate /></ProtectedRoute>} />
          <Route path="/admin/modules/create" element={<ProtectedRoute requiredRole="admin"><AdminModulesCreate /></ProtectedRoute>} />
          <Route path="/admin/lessons/create" element={<ProtectedRoute requiredRole="admin"><AdminLessonsCreate /></ProtectedRoute>} />
          <Route path="/instructor" element={<ProtectedRoute requiredRole="instructor"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute requiredRole="instructor"><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/instructor/courses/:courseId/edit" element={<ProtectedRoute requiredRole="instructor"><AdminCourseEditPage /></ProtectedRoute>} />
          <Route path="/instructor/discussions" element={<ProtectedRoute requiredRole="instructor"><AdminDiscussionsPage /></ProtectedRoute>} />
          <Route path="/instructor/courses/create" element={<ProtectedRoute requiredRole="instructor"><AdminCoursesCreate /></ProtectedRoute>} />
          <Route path="/instructor/modules/create" element={<ProtectedRoute requiredRole="instructor"><AdminModulesCreate /></ProtectedRoute>} />
          <Route path="/instructor/lessons/create" element={<ProtectedRoute requiredRole="instructor"><AdminLessonsCreate /></ProtectedRoute>} />
        </Routes>
        {showChatbot && <Chatbot />}
        <Toaster />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatbotProvider>
          <AppLayout />
        </ChatbotProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
