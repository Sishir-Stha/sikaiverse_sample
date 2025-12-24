import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import type { Course } from '../../types'
import { BookOpen, Plus, Edit2, Eye, Trash2 } from 'lucide-react'

export default function AdminCoursesPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses()
        setCourses(data)
      } catch (error) {
        console.error('Failed to load courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
  }

  const handleEditCourse = (course: Course) => {
    navigate(`/admin/courses/${course.id}/edit`)
  }

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <BookOpen size={32} />
              Manage Courses
            </h1>
            <p className="text-muted-foreground">View, edit, and manage all courses</p>
          </div>
          <Button onClick={() => navigate('/admin/courses/create')} className="gap-2">
            <Plus size={20} />
            Create Course
          </Button>
        </div>

        {/* Courses List */}
        {isLoading ? (
          <p className="text-muted-foreground">Loading courses...</p>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No courses yet</p>
              <Button onClick={() => navigate('/admin/courses/create')}>Create First Course</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {courses.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant="secondary" className="capitalize">{course.level}</Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCourse(course)}
                        className="gap-2"
                      >
                        <Eye size={16} />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCourse(course)}
                        className="gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Modules</p>
                      <p className="font-medium">{course.modules.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lessons</p>
                      <p className="font-medium">{course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{course.duration} hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Course Detail Modal/View */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedCourse.title}</CardTitle>
                  <CardDescription>{selectedCourse.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium">{selectedCourse.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedCourse.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium capitalize">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedCourse.duration} hours</p>
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <h3 className="font-semibold mb-4">Modules ({selectedCourse.modules.length})</h3>
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module, i) => (
                      <Card key={module.id} className="bg-muted/50">
                        <CardContent className="pt-4">
                          <p className="font-medium mb-2">Module {i + 1}: {module.title}</p>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="space-y-2">
                            {module.lessons.map((lesson, j) => (
                              <div key={lesson.id} className="text-sm pl-4 border-l border-border">
                                <p className="font-medium">Lesson {j + 1}: {lesson.title}</p>
                                <p className="text-muted-foreground text-xs">{lesson.duration} min</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      handleEditCourse(selectedCourse)
                      setSelectedCourse(null)
                    }}
                    className="gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Course
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
