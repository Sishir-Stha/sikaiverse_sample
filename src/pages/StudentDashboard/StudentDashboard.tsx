import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Course } from '../../types'
import { BookOpen, CheckCircle2, TrendingUp, Clock } from 'lucide-react'

export default function StudentDashboard() {
  const { enrolledCourses } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses()
        // Filter to only enrolled courses
        const enrolled = data.filter(c => enrolledCourses.includes(c.id))
        setCourses(enrolled)
      } catch (error) {
        console.error('Failed to load courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [enrolledCourses])

  // Calculate progress for a course
  const calculateProgress = (course: Course) => {
    let totalLessons = 0
    let completedLessons = 0
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++
        if (lesson.status === 'completed') completedLessons++
      })
    })
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length.toString(), subtitle: 'Active enrollments', icon: BookOpen },
    { label: 'Completed', value: '0', subtitle: 'Courses finished', icon: CheckCircle2 },
    { label: 'In Progress', value: enrolledCourses.length.toString(), subtitle: 'Currently learning', icon: TrendingUp },
    { label: 'Study Time', value: '24h', subtitle: 'This month', icon: Clock },
  ]

  const recentActivity = [
    { id: '1', title: 'What is React?', course: 'Introduction to React', time: '2 hours ago', icon: '✓' },
    { id: '2', title: 'Props Quiz', course: 'Introduction to React', time: '1 day ago', icon: '📝' },
    { id: '3', title: 'Getting Started', course: 'Introduction to React', time: '2 days ago', icon: '📖' },
  ]

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, user! Continue your learning journey.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className={`animate-stagger-${(i % 4) + 1} card-enhanced`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <Card className="card-enhanced animate-stagger-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading courses...</p>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No enrolled courses yet</p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {courses.map((course, idx) => {
                      const progress = calculateProgress(course)
                      return (
                        <div key={course.id} className={`pb-6 border-b border-border last:border-0 last:pb-0 animate-stagger-${(idx % 3) + 1} transition-all duration-300 hover:bg-muted/50 rounded-lg p-3`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                            <Badge variant="secondary">{progress}%</Badge>
                          </div>
                          <Progress value={progress} max={100} className="mb-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {course.modules.length} modules
                            </span>
                            <Link to={`/courses/${course.id}`}>
                              <Button variant="outline" size="sm">Continue</Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="card-enhanced animate-stagger-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={activity.id} className={`flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0 animate-stagger-${(idx % 3) + 1} transition-all duration-300 hover:bg-muted/50 rounded p-2`}>
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.course}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
