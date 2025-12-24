import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/use-toast'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { success, error } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      success('Login successful!')
      navigate('/')
    } catch (err) {
      error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
          <span className="text-2xl font-bold text-foreground">Sikai Verse</span>
        </div>

        {/* Login Card */}
        <Card className="card-enhanced animate-fade-in-up">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue learning</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="text-sm font-medium text-foreground block mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
              </div>

              {/* Sign In Button */}
              <div className="animate-fade-in-up pt-2" style={{ animationDelay: '0.3s' }}>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
              <p className="text-muted-foreground">Email: user@example.com</p>
              <p className="text-muted-foreground">Password: any password</p>
              <p className="text-muted-foreground mt-2">Admin: admin@example.com</p>
              <p className="text-muted-foreground mt-1">Instructor: instructor@example.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
