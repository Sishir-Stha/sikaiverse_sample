import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  enrolledCourses: string[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  enrollCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  updateProfile: (updates: Partial<User>) => Promise<void>
  resetPassword: (newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  useEffect(() => {
    // Check for stored user and enrollments on mount
    const storedUser = localStorage.getItem('user')
    const storedEnrollments = localStorage.getItem('enrollments')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
        if (storedEnrollments) {
          setEnrolledCourses(JSON.parse(storedEnrollments))
        }
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('enrollments')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    // Determine role and enrollment based on email
    let mockUser: User
    let enrollments: string[] = []

    if (email.includes('admin')) {
      // Admin user
      mockUser = {
        id: 'admin-1',
        name: 'Admin User',
        email,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      }
      enrollments = []
    } else if (email.includes('instructor')) {
      // Instructor user
      mockUser = {
        id: 'instructor-1',
        name: 'Instructor User',
        email,
        role: 'instructor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      }
      enrollments = []
    } else {
      // Student user
      mockUser = {
        id: 'student-1',
        name: 'John Doe',
        email,
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        enrolledCourses: ['1', '2'],
        createdAt: new Date().toISOString(),
      }
      enrollments = ['1', '2']
    }

    setUser(mockUser)
    setIsAuthenticated(true)
    setEnrolledCourses(enrollments)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('enrollments', JSON.stringify(enrollments))
  }

  const register = async (name: string, email: string, password: string) => {
    // Mock register - in production, this would call an API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      enrolledCourses: [],
      createdAt: new Date().toISOString(),
    }
    setUser(mockUser)
    setIsAuthenticated(true)
    setEnrolledCourses([])
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('enrollments', JSON.stringify([]))
  }

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      const updated = [...enrolledCourses, courseId]
      setEnrolledCourses(updated)
      localStorage.setItem('enrollments', JSON.stringify(updated))
      if (user) {
        const updatedUser = { ...user, enrolledCourses: updated }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.includes(courseId)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setEnrolledCourses([])
    localStorage.removeItem('user')
    localStorage.removeItem('enrollments')
  }

  const updateProfile = async (updates: Partial<User>) => {
    // Mock update - in production, this would call an API
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const resetPassword = async (newPassword: string) => {
    // Mock reset - in production, this would call an API
    // In a real app, you'd validate the password and send to backend
    if (user) {
      // Password would be sent securely to backend
      console.log('Password reset requested for:', user.email)
      // For now, just acknowledge the reset
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, enrolledCourses, login, logout, register, enrollCourse, isEnrolled, updateProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
