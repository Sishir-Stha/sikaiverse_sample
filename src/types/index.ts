export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: 'student' | 'admin' | 'instructor'
  avatar?: string
  enrolledCourses?: string[]
  createdAt?: string
   status?: string
}

export type LessonContentType = 'document' | 'video' | 'link' | 'photo' | 'message'

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: string
  contentType: LessonContentType
  duration: number
  videoUrl?: string
  documentUrl?: string
  photoUrl?: string
  externalLink?: string
  order: number
  status: 'completed' | 'in_progress' | 'not_started'
}

export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  students: number
  rating: number
  image: string
  modules: Module[]
  createdAt: string
}

export interface Progress {
  userId: string
  courseId: string
  completedLessons: string[]
  progress: number
  lastAccessed: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ActivityLog {
  id: string
  actor: string
  actionType: 'create' | 'update' | 'delete' | 'enroll' | 'complete'
  entityType: 'course' | 'module' | 'lesson' | 'user'
  entityId: string
  entityName?: string
  timestamp: string
}

export interface EnrollmentRecord {
  userId: string
  courseId: string
  enrolledAt: string
  completedLessons: string[]
}

export interface DiscussionReply {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  likes: number
  isAdmin?: boolean
}

export interface DiscussionPost {
  id: string
  courseId: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  content: string
  createdAt: string
  likes: number
  replies: DiscussionReply[]
}
