import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/use-toast'
import type { Course, Module, Lesson } from '../../types'
import { ArrowLeft, Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { ModulePanel } from '../../components/admin/ModulePanel'
import { LessonPanel } from '../../components/admin/LessonPanel'

export default function AdminCourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  
  // Panel states
  const [modulePanel, setModulePanel] = useState<{ isOpen: boolean; module: Module | null }>({
    isOpen: false,
    module: null,
  })
  const [lessonPanel, setLessonPanel] = useState<{ isOpen: boolean; lesson: Lesson | null; moduleId: string | null }>({
    isOpen: false,
    lesson: null,
    moduleId: null,
  })

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return
      try {
        const data = await api.getCourseById(courseId)
        if (data) {
          setCourse(data)
        } else {
          error('Course not found')
          navigate('/admin/courses')
        }
      } catch (err) {
        console.error('Failed to load course:', err)
        error('Failed to load course')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId, navigate, error])

  const toggleModuleExpand = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleOpenModulePanel = (module?: Module) => {
    setModulePanel({
      isOpen: true,
      module: module || null,
    })
  }

  const handleCloseModulePanel = () => {
    setModulePanel({ isOpen: false, module: null })
  }

  const handleSaveModule = (module: Module) => {
    if (!course) return

    const existingIndex = course.modules.findIndex(m => m.id === module.id)
    let updatedModules: Module[]

    if (existingIndex >= 0) {
      // Update existing module
      updatedModules = course.modules.map((m, idx) => (idx === existingIndex ? module : m))
      success('Module updated successfully')
    } else {
      // Add new module
      updatedModules = [...course.modules, module]
      success('Module created successfully')
    }

    setCourse({ ...course, modules: updatedModules })
    handleCloseModulePanel()
  }

  const handleDeleteModule = (moduleId: string) => {
    if (!course) return

    if (!confirm('Are you sure you want to delete this module and all its lessons?')) {
      return
    }

    setCourse({
      ...course,
      modules: course.modules.filter(m => m.id !== moduleId),
    })

    success('Module deleted successfully')
  }

  const handleOpenLessonPanel = (lesson?: Lesson, moduleId?: string) => {
    setLessonPanel({
      isOpen: true,
      lesson: lesson || null,
      moduleId: moduleId || null,
    })
  }

  const handleCloseLessonPanel = () => {
    setLessonPanel({ isOpen: false, lesson: null, moduleId: null })
  }

  const handleSaveLesson = (lesson: Lesson) => {
    if (!course || !lessonPanel.moduleId) return

    const moduleIndex = course.modules.findIndex(m => m.id === lessonPanel.moduleId)
    if (moduleIndex < 0) return

    const module = course.modules[moduleIndex]
    const lessonIndex = module.lessons.findIndex(l => l.id === lesson.id)

    let updatedModules: Module[]

    if (lessonIndex >= 0) {
      // Update existing lesson
      const updatedLessons = module.lessons.map((l, idx) => (idx === lessonIndex ? lesson : l))
      updatedModules = course.modules.map((m, idx) =>
        idx === moduleIndex ? { ...m, lessons: updatedLessons } : m
      )
      success('Lesson updated successfully')
    } else {
      // Add new lesson
      const updatedLessons = [...module.lessons, lesson]
      updatedModules = course.modules.map((m, idx) =>
        idx === moduleIndex ? { ...m, lessons: updatedLessons } : m
      )
      success('Lesson created successfully')
    }

    setCourse({ ...course, modules: updatedModules })
    handleCloseLessonPanel()
  }

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!course) return

    if (!confirm('Are you sure you want to delete this lesson?')) {
      return
    }

    const updatedModules = course.modules.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    )

    setCourse({
      ...course,
      modules: updatedModules,
    })

    success('Lesson deleted successfully')
  }

  const handleSaveCourse = async () => {
    if (!course) return

    try {
      // In a real app, this would call an API to save
      success('Course updated successfully')
      navigate('/admin/courses')
    } catch (err) {
      console.error('Failed to save course:', err)
      error('Failed to save course')
    }
  }

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
          <Button onClick={() => navigate('/admin/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/courses')}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>

        {/* Course Metadata */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={course.title}
                onChange={e => setCourse({ ...course, title: e.target.value })}
                placeholder="Course title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={course.description}
                onChange={e => setCourse({ ...course, description: e.target.value })}
                placeholder="Course description"
                className="w-full p-2 border border-border rounded-md bg-background text-foreground min-h-24"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Instructor</label>
                <Input
                  value={course.instructor}
                  onChange={e => setCourse({ ...course, instructor: e.target.value })}
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={course.category}
                  onChange={e => setCourse({ ...course, category: e.target.value })}
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <select
                  value={course.level}
                  onChange={e => setCourse({ ...course, level: e.target.value as any })}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules & Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Modules & Lessons</CardTitle>
              <CardDescription>Manage course structure</CardDescription>
            </div>
            <Button
              onClick={() => handleOpenModulePanel()}
              className="gap-2"
            >
              <Plus size={18} />
              Add Module
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Modules List */}
            {course.modules.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No modules yet</p>
                <Button
                  onClick={() => handleOpenModulePanel()}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus size={18} />
                  Create First Module
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-border rounded-lg overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModuleExpand(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        {expandedModules.has(module.id) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                        <div>
                          <p className="font-semibold">Module {moduleIndex + 1}: {module.title}</p>
                          <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleOpenModulePanel(module)
                          }}
                          className="gap-1"
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleDeleteModule(module.id)
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </button>

                    {/* Module Content */}
                    {expandedModules.has(module.id) && (
                      <div className="border-t border-border p-4 bg-muted/20 space-y-4">
                        {/* Module Description */}
                        {module.description && (
                          <div className="p-3 bg-background rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        )}

                        {/* Lessons List */}
                        {module.lessons.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-sm text-muted-foreground mb-3">No lessons yet</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenLessonPanel(undefined, module.id)}
                              className="gap-1"
                            >
                              <Plus size={16} />
                              Add Lesson
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium">Lesson {lessonIndex + 1}: {lesson.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {lesson.contentType} • {lesson.duration} min
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenLessonPanel(lesson, module.id)}
                                    className="gap-1"
                                  >
                                    <Edit2 size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Lesson Button */}
                        <div className="border-t border-border pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenLessonPanel(undefined, module.id)}
                            className="w-full gap-2"
                          >
                            <Plus size={16} />
                            Add Lesson to This Module
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSaveCourse} size="lg" className="flex-1">
            Save Changes
          </Button>
          <Button
            onClick={() => navigate('/admin/courses')}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Module Panel */}
      <ModulePanel
        module={modulePanel.module}
        isOpen={modulePanel.isOpen}
        onClose={handleCloseModulePanel}
        onSave={handleSaveModule}
        courseId={course.id}
      />

      {/* Lesson Panel */}
      <LessonPanel
        lesson={lessonPanel.lesson}
        isOpen={lessonPanel.isOpen}
        onClose={handleCloseLessonPanel}
        onSave={handleSaveLesson}
        moduleId={lessonPanel.moduleId || ''}
      />
    </div>
  )
}
