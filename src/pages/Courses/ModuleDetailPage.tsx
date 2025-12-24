import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Course, Module } from '../../types'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'

export default function ModuleDetailPage() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>()
  const navigate = useNavigate()
  const { isEnrolled } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !moduleId) return
      try {
        const courseData = await api.getCourseById(courseId)
        if (courseData) {
          setCourse(courseData)
          const foundModule = courseData.modules.find(m => m.id === moduleId)
          setModule(foundModule || null)
        }
      } catch (error) {
        console.error('Failed to load module:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [courseId, moduleId])

  // Check enrollment
  if (!isEnrolled(courseId!)) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You must be enrolled in this course to view modules</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading module...</p>
      </div>
    )
  }

  if (!course || !module) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Module not found</p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</Button>
        </div>
      </div>
    )
  }

  // Calculate module progress
  const totalLessons = module.lessons.length
  const completedLessons = module.lessons.filter(l => l.status === 'completed').length
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => navigate('/courses')}
            className="text-primary hover:underline"
          >
            Courses
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-primary hover:underline"
          >
            {course.title}
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{module.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Course
        </button>

        {/* Module Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{module.title}</CardTitle>
                <CardDescription className="text-base">{module.description}</CardDescription>
              </div>
              <Badge variant="secondary">{module.lessons.length} lessons</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} max={100} />
              </div>
              <div className="text-sm text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {module.lessons.length === 0 ? (
              <p className="text-muted-foreground">No lessons in this module yet</p>
            ) : (
              <div className="space-y-3">
                {module.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`)}
                    className="w-full text-left flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted hover:border-primary transition-all"
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {lesson.status === 'completed' ? (
                        <span className="text-lg">✓</span>
                      ) : lesson.status === 'in_progress' ? (
                        <span className="text-lg">⚡</span>
                      ) : (
                        <span className="text-lg">○</span>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{index + 1}. {lesson.title}</span>
                        {lesson.status === 'completed' && (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                    </div>

                    {/* Duration */}
                    <div className="flex-shrink-0 flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={16} />
                      {lesson.duration} min
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Learning Button */}
        {module.lessons.length > 0 && (
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                const firstLesson = module.lessons[0]
                navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${firstLesson.id}`)
              }}
            >
              Start Learning
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
