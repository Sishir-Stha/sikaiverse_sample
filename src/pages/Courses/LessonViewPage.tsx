import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Lesson, Module, Course } from '../../types'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'

export default function LessonViewPage() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { isEnrolled } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const loadLesson = async () => {
      if (!courseId || !moduleId || !lessonId) return
      try {
        const courseData = await api.getCourseById(courseId)
        if (courseData) {
          setCourse(courseData)
          const foundModule = courseData.modules.find(m => m.id === moduleId)
          if (foundModule) {
            setModule(foundModule)
            const foundLesson = foundModule.lessons.find(l => l.id === lessonId)
            if (foundLesson) {
              setLesson(foundLesson)
              setIsCompleted(foundLesson.status === 'completed')
            }
          }
        }
      } catch (error) {
        console.error('Failed to load lesson:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLesson()
  }, [courseId, moduleId, lessonId])

  const handleMarkComplete = () => {
    if (!lesson || !module || !course) return

    // Update lesson status
    const updatedLesson = { ...lesson, status: 'completed' as const }
    setLesson(updatedLesson)
    setIsCompleted(true)

    // Update module with updated lesson
    const updatedModule = {
      ...module,
      lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l),
    }
    setModule(updatedModule)

    // Update course with updated module
    const updatedCourse = {
      ...course,
      modules: course.modules.map(m => m.id === module.id ? updatedModule : m),
    }
    setCourse(updatedCourse)

    // In production, this would call an API to persist
  }

  const getNextLesson = () => {
    if (!module || !lesson) return null
    const currentIndex = module.lessons.findIndex(l => l.id === lesson.id)
    if (currentIndex < module.lessons.length - 1) {
      return module.lessons[currentIndex + 1]
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!module || !lesson) return null
    const currentIndex = module.lessons.findIndex(l => l.id === lesson.id)
    if (currentIndex > 0) {
      return module.lessons[currentIndex - 1]
    }
    return null
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading lesson...</p>
      </div>
    )
  }

  if (!course || !module || !lesson) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Lesson not found</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button onClick={() => navigate('/courses')} className="hover:text-foreground">
            Courses
          </button>
          <span>/</span>
          <button onClick={() => navigate(`/courses/${courseId}`)} className="hover:text-foreground">
            {course.title}
          </button>
          <span>/</span>
          <span>{module.title}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-muted-foreground text-lg">{lesson.description}</p>
            </div>
            <Badge className={isCompleted ? 'bg-green-600' : 'bg-blue-600'}>
              {isCompleted ? 'Completed' : lesson.status === 'in_progress' ? 'In Progress' : 'Not Started'}
            </Badge>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{lesson.duration} minutes</span>
            </div>
            {lesson.videoUrl && (
              <div className="flex items-center gap-2">
                <span>📹 Video available</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Placeholder */}
        {lesson.videoUrl && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📹</div>
                  <p className="text-muted-foreground">Video Player</p>
                  <p className="text-sm text-muted-foreground mt-1">{lesson.videoUrl}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {lesson.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mark Complete Button */}
        {!isCompleted && (
          <Card className="mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Lesson Complete?</h3>
                  <p className="text-sm text-muted-foreground">Mark this lesson as completed to track your progress</p>
                </div>
                <Button onClick={handleMarkComplete} className="gap-2">
                  <CheckCircle2 size={18} />
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {previousLesson ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${previousLesson.id}`)}
              className="gap-2"
            >
              <ChevronLeft size={18} />
              Previous: {previousLesson.title}
            </Button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Button
              onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`)}
              className="gap-2"
            >
              Next: {nextLesson.title}
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)} variant="outline">
              Back to Module
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
