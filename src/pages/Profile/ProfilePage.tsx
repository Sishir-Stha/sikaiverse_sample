import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/use-toast'
import { Edit2, Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, updateProfile, resetPassword } = useAuth()
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Edit form state (includes password fields)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      error('Name and email are required')
      return
    }

    // Check if password fields have values (password change requested)
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword.length < 8) {
        error('Password must be at least 8 characters')
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        error('Passwords do not match. Please try again.')
        return
      }
    }

    try {
      // Update profile info
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      })

      // Update password if provided
      if (formData.newPassword) {
        await resetPassword(formData.newPassword)
        success('Password has been successfully changed.')
      } else {
        success('Profile updated successfully')
      }

      setIsEditing(false)
      // Reset password fields
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))
    } catch (err) {
      error('Failed to update profile')
    }
  }

  const enrolledCoursesCount = user?.enrolledCourses?.length || 0

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {user?.role === 'admin' ? 'Admin Settings' : 'My Profile'}
          </h1>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              {isEditing ? 'Update your profile details' : 'Your profile details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated from your email
                </p>
              </div>
            </div>

            {isEditing ? (
              <>
                {/* Edit Form */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +977-98xxxxxx"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g., Kathmandu, Nepal"
                      className="mt-1"
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Change Password (Optional)</h3>
                    
                    <div>
                      <label className="text-sm font-medium">New Password</label>
                      <div className="relative mt-1">
                        <Input
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password (min 8 characters)"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm font-medium">Confirm Password</label>
                      <div className="relative mt-1">
                        <Input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-6">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          newPassword: '',
                          confirmPassword: '',
                        })
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Display Mode */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-semibold">{formData.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold">{formData.email}</p>
                  </div>

                  {formData.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="text-lg font-semibold">{formData.phone}</p>
                    </div>
                  )}

                  {formData.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-lg font-semibold">{formData.address}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-lg font-semibold capitalize">{user?.role}</p>
                  </div>

                  {user?.role === 'student' && (
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                      <p className="text-lg font-semibold">{enrolledCoursesCount} course{enrolledCoursesCount !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
