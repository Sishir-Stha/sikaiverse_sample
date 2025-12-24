import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Course, Module, Lesson } from '../../types'
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle2, Clock, BookOpen } from 'lucide-react'

export default function CourseLearnPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { isEnrolled, isAuthenticated } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return
      try {
        const courseData = await api.getCourseById(courseId)
        if (!courseData) return
        setCourse(courseData)

        // Find the first incomplete lesson to show initially
        let firstLesson: Lesson | null = null
        let firstModule: Module | null = null

        for (const module of courseData.modules) {
          for (const lesson of module.lessons) {
            if (lesson.status !== 'completed') {
              firstLesson = lesson
              firstModule = module
              break
            }
          }
          if (firstLesson) break
        }

        // If all lessons are completed, show the first lesson
        if (!firstLesson && courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
          firstLesson = courseData.modules[0].lessons[0]
          firstModule = courseData.modules[0]
        }

        setCurrentLesson(firstLesson)
        setCurrentModule(firstModule)

        // Expand the module containing the current lesson
        if (firstModule) {
          setExpandedModules(new Set([firstModule.id]))
        }
      } catch (error) {
        console.error('Failed to load course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  const handleLessonClick = (lesson: Lesson, module: Module) => {
    setCurrentLesson(lesson)
    setCurrentModule(module)
  }

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleMarkComplete = () => {
    if (!currentLesson || !currentModule || !course) return

    // Update lesson status
    const updatedLesson = { ...currentLesson, status: 'completed' as const }

    // Update module with updated lesson
    const updatedModule = {
      ...currentModule,
      lessons: currentModule.lessons.map(l => l.id === currentLesson.id ? updatedLesson : l),
    }

    // Update course with updated module
    const updatedCourse = {
      ...course,
      modules: course.modules.map(m => m.id === currentModule.id ? updatedModule : m),
    }

    setCourse(updatedCourse)
    setCurrentLesson(updatedLesson)
    setCurrentModule(updatedModule)
  }

  const getNextLesson = () => {
    if (!currentModule || !currentLesson || !course) return null
    const currentIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id)
    if (currentIndex < currentModule.lessons.length - 1) {
      return { lesson: currentModule.lessons[currentIndex + 1], module: currentModule }
    }
    // Find next module
    const moduleIndex = course.modules.findIndex(m => m.id === currentModule.id)
    if (moduleIndex < course.modules.length - 1) {
      const nextModule = course.modules[moduleIndex + 1]
      if (nextModule && nextModule.lessons.length > 0) {
        return { lesson: nextModule.lessons[0], module: nextModule }
      }
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!currentModule || !currentLesson || !course) return null
    const currentIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id)
    if (currentIndex > 0) {
      return { lesson: currentModule.lessons[currentIndex - 1], module: currentModule }
    }
    // Find previous module
    const moduleIndex = course.modules.findIndex(m => m.id === currentModule.id)
    if (moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1]
      if (prevModule && prevModule.lessons.length > 0) {
        return { lesson: prevModule.lessons[prevModule.lessons.length - 1], module: prevModule }
      }
    }
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You must be logged in to access this course</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    )
  }

  if (!isEnrolled(courseId!)) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You must be enrolled in this course to access lessons</p>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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

  const nextLessonData = getNextLesson()
  const previousLessonData = getPreviousLesson()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-primary hover:underline mb-2"
          >
            <ArrowLeft size={16} />
            Back to Course
          </button>
          <h2 className="font-semibold text-lg truncate">{course.title}</h2>
        </div>

        {/* Modules and Lessons */}
        <div className="flex-1 overflow-y-auto">
          {course.modules.map((module) => (
            <div key={module.id} className="border-b border-border">
              <button
                onClick={() => toggleModuleExpansion(module.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span className="font-medium truncate">{module.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                </div>
                {expandedModules.has(module.id) ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </button>

              {expandedModules.has(module.id) && (
                <div className="bg-muted/30">
                  {module.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson, module)}
                      className={`w-full p-3 pl-8 text-left hover:bg-muted transition-colors ${
                        currentLesson?.id === lesson.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs">
                          {lesson.status === 'completed' ? (
                            <span className="text-green-600">✓</span>
                          ) : lesson.status === 'in_progress' ? (
                            <span className="text-blue-600">⚡</span>
                          ) : (
                            <span className="text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${currentLesson?.id === lesson.id ? 'font-medium' : ''}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentLesson && currentModule ? (
          <>
            {/* Lesson Header */}
            <div className="p-6 border-b border-border">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                    <p className="text-muted-foreground text-lg">{currentLesson.description}</p>
                  </div>
                  <Badge className={currentLesson.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}>
                    {currentLesson.status === 'completed' ? 'Completed' : currentLesson.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{currentLesson.duration} minutes</span>
                  </div>
                  {currentLesson.videoUrl && (
                    <div className="flex items-center gap-2">
                      <span>📹 Video available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-6">
                {/* Video Placeholder */}
                {currentLesson.videoUrl && (
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📹</div>
                          <p className="text-muted-foreground">Video Player</p>
                          <p className="text-sm text-muted-foreground mt-1">{currentLesson.videoUrl}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lesson Content */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Lesson Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {currentLesson.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mark Complete Button */}
                {currentLesson.status !== 'completed' && (
                  <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
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
                  {previousLessonData ? (
                    <Button
                      variant="outline"
                      onClick={() => handleLessonClick(previousLessonData.lesson, previousLessonData.module)}
                      className="gap-2"
                    >
                      <ChevronRight size={18} className="rotate-180" />
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {nextLessonData ? (
                    <Button
                      onClick={() => handleLessonClick(nextLessonData.lesson, nextLessonData.module)}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight size={18} />
                    </Button>
                  ) : (
                    <Button onClick={() => navigate(`/courses/${courseId}`)} variant="outline">
                      Back to Course
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No lessons available</p>
              <Button onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}