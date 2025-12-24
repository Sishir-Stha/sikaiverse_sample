import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/use-toast'
import TopBar from '../../components/TopBar'
import type { Course } from '../../types'
import {
  ArrowLeft,
  Star,
  MessageCircle,
  CheckCircle,
  Award,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, isEnrolled, enrollCourse } = useAuth()
  const { success, error } = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return
      try {
        const data = await api.getCourseById(courseId)
        setCourse(data)
      } catch (error) {
        console.error('Failed to load course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  // Calculate course progress
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter(l => l.status === 'completed').length,
    0
  )
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const enrolled = isEnrolled(courseId!)

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(isAuthenticated ? '/courses' : '/browse')}
            className="flex items-center gap-2 text-primary hover:underline mb-6 transition-all duration-200 hover:gap-3"
          >
            <ArrowLeft size={20} />
            {isAuthenticated ? 'Back to Courses' : 'Back to Explore'}
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Provider Info */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {course.instructor.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {course.instructor}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>

              {/* Info Chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Modules</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.modules.length}
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.rating}
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Level</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {course.level}
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.duration}h
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Enrollment Block */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden mb-6">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Enrollment Info */}
                  {!enrolled ? (
                    <>
                      <Button
                        size="lg"
                        className="w-full mb-3"
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login')
                            return
                          }
                          enrollCourse(courseId!)
                          success('Successfully enrolled in ' + course.title)
                        }}
                      >
                        {isAuthenticated ? 'Enroll for free' : 'Sign in to Enroll'}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full mb-4"
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login')
                          }
                        }}
                      >
                        {isAuthenticated ? 'Try for free' : 'Sign in to Try'}
                      </Button>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        {course.students.toLocaleString()} already enrolled
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Course Progress
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {courseProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {completedLessons} of {totalLessons} lessons completed
                        </p>
                      </div>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login')
                            return
                          }
                          window.open(`/courses/${courseId}/learn`, '_blank')
                        }}
                      >
                        {isAuthenticated ? 'Continue Learning' : 'Sign in to Continue'}
                      </Button>
                    </>
                  )}

                  {/* Sidebar Info */}
                  <div className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Shareable Certificate</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Earn a certificate upon completion
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Language</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">English</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skills You'll Gain</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Instructor</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {course.instructor.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.instructor}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Expert Instructor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {enrolled && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  What you'll learn
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Master the key concepts and skills covered in this course through comprehensive lessons and hands-on projects.
                </p>
                <ul className="space-y-3">
                  {[
                    'Understand core concepts and principles',
                    'Apply practical techniques to real-world scenarios',
                    'Build projects and develop your portfolio',
                    'Gain industry-recognized skills',
                    'Learn from expert instructors',
                    'Access lifetime course materials',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Skills You'll Gain */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Skills you'll gain
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    course.category,
                    'Problem Solving',
                    'Critical Thinking',
                    'Project Management',
                    'Communication',
                    'Technical Skills',
                  ].map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-2 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Certificate Section */}
              <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-4">
                  <Award size={32} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Earn a shareable certificate
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Complete the course and earn a certificate that you can share with employers and on your professional network.
                    </p>
                    <div className="flex gap-2">
                      <img
                        src="https://via.placeholder.com/40"
                        alt="Partner"
                        className="w-10 h-10 rounded-full"
                      />
                      <img
                        src="https://via.placeholder.com/40"
                        alt="Partner"
                        className="w-10 h-10 rounded-full"
                      />
                      <img
                        src="https://via.placeholder.com/40"
                        alt="Partner"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Syllabus */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Syllabus
                </h2>
                <div className="space-y-3">
                  {course.modules.map((module, idx) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedModule(expandedModule === module.id ? null : module.id)
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            Module {idx + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {module.lessons.length} lessons
                          </p>
                        </div>
                        {expandedModule === module.id ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </button>

                      {expandedModule === module.id && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {module.description}
                          </p>
                          <ul className="space-y-2">
                            {module.lessons.map((lesson, lessonIdx) => (
                              <li key={lesson.id} className="text-sm text-gray-700 dark:text-gray-300">
                                {lessonIdx + 1}. {lesson.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 space-y-6">
                  {/* Quick Links */}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                      Course Resources
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full text-left text-sm text-blue-600 hover:underline flex items-center gap-2">
                        <Share2 size={16} />
                        Share this course
                      </button>
                      <button
                        onClick={() => navigate(`/courses/${courseId}/forum`)}
                        className="w-full text-left text-sm text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Discussion Forum
                      </button>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                      Course Stats
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Enrolled Students</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.students.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Average Rating</p>
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {course.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
