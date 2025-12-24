import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { BookOpen, Users, Eye, BarChart3 } from 'lucide-react'

export default function InstructorDashboard() {
  // Mock data - similar to admin but filtered or focused for instructor
  const stats = [
    { label: 'Total Courses', value: '2', subtitle: 'Active courses', icon: BookOpen },
    { label: 'Total Students', value: '45', subtitle: 'Enrolled in your courses', icon: Users },
    { label: 'Total Modules', value: '3', subtitle: 'Across your courses', icon: Eye },
    { label: 'Completion Rate', value: '73%', subtitle: 'Average course completion', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your learning platform and courses</p>
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

        {/* Quick Actions - Exact same as Admin */}
        <Card className="mb-12 card-enhanced animate-stagger-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚙️</span>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Create Course', icon: '➕', href: '/instructor/courses/create' },
                { title: 'Add Module', icon: '👁️', href: '/instructor/modules/create' },
                { title: 'Create Lesson', icon: '📖', href: '/instructor/lessons/create' },
              ].map((action, i) => (
                <Link key={i} to={action.href}>
                  <div className={`flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:bg-muted transition-all duration-300 cursor-pointer animate-stagger-${(i % 3) + 1} hover:shadow-lg hover:scale-105`}>
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <p className="font-medium text-center">{action.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note: User Management section from AdminDashboard is explicitly excluded here */}
        
        <Card className="card-enhanced animate-stagger-2">
          <CardHeader>
            <CardTitle>Instructor Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have administrative access to manage all courses, modules, and lessons. 
              The User Management section is restricted to Platform Administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
