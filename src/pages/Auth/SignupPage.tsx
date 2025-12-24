import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useToast } from '../../hooks/use-toast'
import { BookOpen, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'admin',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      error('Please fix the errors above')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user creation - store in localStorage
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        email: formData.email,
        name: formData.username,
        role: formData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        enrolledCourses: [],
      }

      // Store user in localStorage (mock database)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = existingUsers.some((u: any) => u.email === formData.email)

      if (userExists) {
        error('Email already registered')
        setIsLoading(false)
        return
      }

      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))

      success(`Account created successfully! Welcome, ${formData.username}`)

      // Redirect to login
      setTimeout(() => {
        navigate('/login', { state: { email: formData.email } })
      }, 1500)
    } catch (err) {
      console.error('Signup error:', err)
      error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Website Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:underline mb-6 transition-all duration-200 hover:gap-3 animate-fade-in-up"
        >
          <ArrowLeft size={20} />
          Back to Website
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">Sikai Verse</span>
        </div>

        {/* Signup Card */}
        <Card className="shadow-lg card-enhanced animate-fade-in-up">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join thousands of learners. Get started for free.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Username */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${errors.username ? 'border-destructive' : ''}`}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${errors.password ? 'border-destructive' : ''}`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock size={16} />
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <label className="text-sm font-medium">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground transition-all duration-200"
                >
                  <option value="student">Student</option>
                  <option value="admin">Instructor/Admin</option>
                </select>
              </div>

              {/* Signup Button */}
              <div className="animate-fade-in-up pt-2" style={{ animationDelay: '0.6s' }}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight size={18} />}
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
