import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import type { User } from '../../types'
import { Users, ArrowUpDown, Plus } from 'lucide-react'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import UserEditPanel from '@/components/UserEditPanel'

type SortField = 'name' | 'email' | 'role' | 'createdAt'
type SortOrder = 'asc' | 'desc'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }
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
  const sortedUsers = [...users].sort((a, b) => {
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]

    if (sortField === 'createdAt') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors"
    >
      {label}
      {sortField === field && <ArrowUpDown size={14} />}
    </button>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Users size={32} />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage platform users and their roles</p>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
                   <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus size={18} className="mr-2" />
                Add User
              </Button>
            <CardDescription>{users.length} total users</CardDescription>
           
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">
                        <SortHeader field="name" label="Name" />
                      </th>
                      <th className="text-left py-3 px-4">
                        <SortHeader field="email" label="Email" />
                      </th>
                      <th className="text-left py-3 px-4">
                        <SortHeader field="role" label="Role" />
                      </th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">
                        <SortHeader field="createdAt" label="Joined" />
                      </th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(user => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {user.avatar && (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            )}
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
                {/* Edit Panel */}
             
        
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
