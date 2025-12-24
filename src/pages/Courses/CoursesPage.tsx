import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/use-toast'
import type { Course } from '../../types'
import { Search } from 'lucide-react'

export default function CoursesPage() {
  const { isEnrolled, enrollCourse, user } = useAuth()
  const { success } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses()
        // For students: show only enrolled courses
        // For admins: show all courses
        const displayCourses = user?.role === 'admin' ? data : data.filter(c => isEnrolled(c.id))
        setCourses(displayCourses)
        setFilteredCourses(displayCourses)
      } catch (error) {
        console.error('Failed to load courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [user?.role, isEnrolled])

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [searchTerm, courses])

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">Discover and enroll in courses to expand your skills</p>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const enrolled = isEnrolled(course.id)
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {enrolled && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600">Enrolled</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{course.students} students</span>
                        <span className="text-yellow-500">★ {course.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {course.duration} hours • {course.modules.length} modules • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/courses/${course.id}`} className="flex-1">
                          <Button className="w-full" variant={enrolled ? 'outline' : 'default'}>
                            {enrolled ? 'Continue' : 'View'}
                          </Button>
                        </Link>
                        {!enrolled && (
                          <Button
                            onClick={() => {
                              enrollCourse(course.id)
                              success('Enrolled in ' + course.title)
                            }}
                            className="flex-1"
                          >
                            Enroll
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
