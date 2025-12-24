import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { BookOpen, LayoutDashboard, Users, Settings, LogOut, User, MessageCircle } from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  const isAdmin = user?.role === 'admin'
  const isInstructor = user?.role === 'instructor'

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard',
    },
    ...(isAdmin
      ? [{ label: 'Courses', icon: BookOpen, path: '/admin/courses' }]
      : isInstructor
      ? [{ label: 'Courses', icon: BookOpen, path: '/instructor/courses' }]
      : [{ label: 'Courses', icon: BookOpen, path: '/courses' }]),
    ...(isAdmin
      ? [{ label: 'Discussions', icon: MessageCircle, path: '/admin/discussions' }]
      : isInstructor
      ? [{ label: 'Discussions', icon: MessageCircle, path: '/instructor/discussions' }]
      : []),
    ...(isAdmin ? [{ label: 'Users', icon: Users, path: '/admin/users' }] : []),
    { label: isAdmin ? 'Settings' : 'Profile', icon: User, path: '/profile' },
  ]

  const managementItems =
    isAdmin || isInstructor
      ? [
          {
            label: 'Create Course',
            path: isAdmin ? '/admin/courses/create' : '/instructor/courses/create',
          },
          {
            label: 'Create Module',
            path: isAdmin ? '/admin/modules/create' : '/instructor/modules/create',
          },
          {
            label: 'Create Lesson',
            path: isAdmin ? '/admin/lessons/create' : '/instructor/lessons/create',
          },
        ]
      : []

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <button
          onClick={() =>
            navigate(isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard')
          }
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">Sikai Verse</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-4">Navigation</h3>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive(item.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Management Section */}
        {managementItems.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-4 mt-6">Management</h3>
            {managementItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
              >
                <span className="text-lg">⚙️</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center gap-3">
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize truncate">{user?.role}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  )
}
