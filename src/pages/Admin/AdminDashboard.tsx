import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, BookOpen, Users, Eye, BarChart3, Trash2 } from 'lucide-react'
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog'
import UserEditPanel from '../../components/UserEditPanel'

interface User {
  id: string
  name: string
  email: string
  role: 'Student' | 'Admin'
  status: 'Active' | 'Inactive'
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'user@example.com', role: 'Student', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  ])

  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const stats = [
    { label: 'Total Courses', value: '2', subtitle: 'Active courses', icon: BookOpen },
    { label: 'Total Users', value: users.length.toString(), subtitle: `${users.filter(u => u.role === 'Admin').length} admins, ${users.filter(u => u.role === 'Student').length} students`, icon: Users },
    { label: 'Total Modules', value: '3', subtitle: 'Across all courses', icon: Eye },
    { label: 'Completion Rate', value: '73%', subtitle: 'Average course completion', icon: BarChart3 },
  ]

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditPanelOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setEditPanelOpen(true)
  }

  const handleSaveUser = async (formData: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (selectedUser?.id) {
        // Update existing user
        setUsers(users.map(u => u.id === selectedUser.id ? { ...formData, id: selectedUser.id } : u))
      } else {
        // Add new user
        setUsers([...users, { ...formData, id: Date.now().toString() }])
      }
      
      setEditPanelOpen(false)
      setSelectedUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(users.filter(u => u.id !== userToDelete.id))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your learning platform and users</p>
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

        {/* Quick Actions */}
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
                { title: 'Create Course', icon: '➕', href: '/admin/courses/create' },
                { title: 'Add Module', icon: '👁️', href: '/admin/modules/create' },
                { title: 'Create Lesson', icon: '📖', href: '/admin/lessons/create' },
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

        {/* User Management */}
        <Card className="card-enhanced animate-stagger-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                User Management
              </CardTitle>
              <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus size={18} className="mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className={`border-b border-border hover:bg-muted/50 transition-all duration-300 animate-stagger-${(idx % 3) + 1}`}>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Panel */}
        <UserEditPanel
          isOpen={editPanelOpen}
          user={selectedUser}
          isLoading={isLoading}
          onClose={() => setEditPanelOpen(false)}
          onSave={handleSaveUser}
        />

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          title="Delete User"
          description="This action cannot be undone. The user will be permanently deleted."
          itemName={userToDelete?.name}
          onConfirm={confirmDeleteUser}
          onCancel={() => setDeleteDialogOpen(false)}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
