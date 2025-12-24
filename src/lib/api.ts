import type { Course, Lesson, Module, ActivityLog, EnrollmentRecord, User } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Mock users data
const mockUsers: User[] = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com',
    enrolledCourses: ['1', '2'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin@example.com',
    enrolledCourses: [],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com',
    enrolledCourses: ['3'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock API responses
export const api = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockCourses
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockCourses.find(c => c.id === id) || null
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockUsers
  },

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || 'Untitled',
      description: data.description || '',
      instructor: data.instructor || 'Unknown',
      category: data.category || 'General',
      level: data.level || 'beginner',
      duration: data.duration || 0,
      students: 0,
      rating: 0,
      image: data.image || 'https://via.placeholder.com/400x300',
      modules: [],
      createdAt: new Date().toISOString(),
    }
    mockCourses.push(newCourse)
    return newCourse
  },

  // Modules
  createModule: async (courseId: string, data: Partial<Module>): Promise<Module> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      courseId,
      title: data.title || 'Untitled Module',
      description: data.description || '',
      order: data.order || 0,
      lessons: [],
    }
    const course = mockCourses.find(c => c.id === courseId)
    if (course) {
      course.modules.push(newModule)
    }
    return newModule
  },

  // Lessons
  createLesson: async (moduleId: string, data: Partial<Lesson>): Promise<Lesson> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      moduleId,
      title: data.title || 'Untitled Lesson',
      description: data.description || '',
      content: data.content || '',
      duration: data.duration || 0,
      videoUrl: data.videoUrl,
      order: data.order || 0,
      status: 'not_started',
      contentType: 'link'
    }
    // Find and update module
    for (const course of mockCourses) {
      const module = course.modules.find(m => m.id === moduleId)
      if (module) {
        module.lessons.push(newLesson)
        break
      }
    }
    return newLesson
  },

  updateLesson: async (lessonId: string, data: Partial<Lesson>): Promise<Lesson | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    for (const course of mockCourses) {
      for (const module of course.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId)
        if (lesson) {
          const updatedLesson = { ...lesson, ...data }
          const index = module.lessons.indexOf(lesson)
          module.lessons[index] = updatedLesson
          return updatedLesson
        }
      }
    }
    return null
  },

  updateModule: async (moduleId: string, data: Partial<Module>): Promise<Module | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    for (const course of mockCourses) {
      const module = course.modules.find(m => m.id === moduleId)
      if (module) {
        const updatedModule = { ...module, ...data }
        const index = course.modules.indexOf(module)
        course.modules[index] = updatedModule
        return updatedModule
      }
    }
    return null
  },

  // Chatbot
  chatbot: async (message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return getChatbotResponse(message)
  },
}

// Mock data with full Course → Module → Lesson structure
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React and build modern web applications',
    instructor: 'Sarah Chen',
    category: 'Web Development',
    level: 'beginner',
    duration: 40,
    students: 1250,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop',
    modules: [
      {
        id: 'm1',
        courseId: '1',
        title: 'Getting Started',
        description: 'Introduction to React',
        order: 1,
        lessons: [
          {
            id: 'l1',
            moduleId: 'm1',
            title: 'What is React?',
            description: 'Understanding React basics',
            content: '# What is React?\n\nReact is a JavaScript library for building user interfaces with reusable components.\n\n## Key Concepts\n- Components\n- JSX\n- State and Props\n- Hooks',
            duration: 15,
            videoUrl: 'https://example.com/video1',
            order: 1,
            status: 'completed',
            contentType: 'link'
          },
          {
            id: 'l2',
            moduleId: 'm1',
            title: 'JSX Syntax',
            description: 'Learn JSX syntax',
            content: '# JSX Syntax\n\nJSX is a syntax extension to JavaScript that looks similar to XML.\n\n```jsx\nconst element = <h1>Hello, world!</h1>;\n```',
            duration: 20,
            videoUrl: 'https://example.com/video2',
            order: 2,
            status: 'in_progress',
            contentType: 'link'
          },
          {
            id: 'l3',
            moduleId: 'm1',
            title: 'Components and Props',
            description: 'Understanding React components',
            content: '# Components and Props\n\nComponents are the building blocks of React applications.',
            duration: 18,
            videoUrl: 'https://example.com/video3',
            order: 3,
            status: 'not_started',
            contentType: 'link'
          },
        ],
      },
      {
        id: 'm2',
        courseId: '1',
        title: 'Hooks and State',
        description: 'Master React Hooks',
        order: 2,
        lessons: [
          {
            id: 'l4',
            moduleId: 'm2',
            title: 'useState Hook',
            description: 'Managing state with useState',
            content: '# useState Hook\n\nThe useState hook lets you add state to functional components.',
            duration: 25,
            videoUrl: 'https://example.com/video4',
            order: 1,
            status: 'not_started',
            contentType: 'link'
          },
          {
            id: 'l5',
            moduleId: 'm2',
            title: 'useEffect Hook',
            description: 'Side effects with useEffect',
            content: '# useEffect Hook\n\nThe useEffect hook lets you perform side effects in functional components.',
            duration: 30,
            videoUrl: 'https://example.com/video5',
            order: 2,
            status: 'not_started',
            contentType: 'link'
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript for large-scale applications',
    instructor: 'Mike Johnson',
    category: 'Programming',
    level: 'advanced',
    duration: 60,
    students: 890,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop',
    modules: [
      {
        id: 'm3',
        courseId: '2',
        title: 'TypeScript Basics',
        description: 'Introduction to TypeScript',
        order: 1,
        lessons: [
          {
            id: 'l6',
            moduleId: 'm3',
            title: 'Types and Interfaces',
            description: 'Understanding types',
            content: '# Types and Interfaces\n\nTypeScript provides static typing for JavaScript.',
            duration: 20,
            videoUrl: 'https://example.com/video6',
            order: 1,
            status: 'not_started',
            contentType: 'link'
          },
          {
            id: 'l7',
            moduleId: 'm3',
            title: 'Generics',
            description: 'Working with generics',
            content: '# Generics\n\nGenerics allow you to write reusable code.',
            duration: 25,
            videoUrl: 'https://example.com/video7',
            order: 2,
            status: 'not_started',
            contentType: 'link'
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Web Design Masterclass',
    description: 'Create beautiful and responsive web designs',
    instructor: 'Emma Wilson',
    category: 'Design',
    level: 'intermediate',
    duration: 50,
    students: 2100,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    modules: [
      {
        id: 'm4',
        courseId: '3',
        title: 'Design Principles',
        description: 'Fundamental design principles',
        order: 1,
        lessons: [
          {
            id: 'l8',
            moduleId: 'm4',
            title: 'Color Theory',
            description: 'Understanding colors in design',
            content: '# Color Theory\n\nColor is a fundamental element of design.',
            duration: 22,
            videoUrl: 'https://example.com/video8',
            order: 1,
            status: 'not_started',
            contentType: 'link'
          },
          {
            id: 'l9',
            moduleId: 'm4',
            title: 'Typography',
            description: 'Choosing and using fonts',
            content: '# Typography\n\nTypography is the art of arranging type.',
            duration: 20,
            videoUrl: 'https://example.com/video9',
            order: 2,
            status: 'not_started',
            contentType: 'link'
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    instructor: 'Alex Kumar',
    category: 'Backend',
    level: 'intermediate',
    duration: 55,
    students: 1650,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    modules: [
      {
        id: 'm5',
        courseId: '4',
        title: 'Node.js Fundamentals',
        description: 'Getting started with Node.js',
        order: 1,
        lessons: [
          {
            id: 'l10',
            moduleId: 'm5',
            title: 'Introduction to Node.js',
            description: 'What is Node.js',
            content: '# Introduction to Node.js\n\nNode.js is a JavaScript runtime built on Chrome\'s V8 engine.',
            duration: 18,
            videoUrl: 'https://example.com/video10',
            order: 1,
            status: 'not_started',
            contentType: 'link'
          },
          {
            id: 'l11',
            moduleId: 'm5',
            title: 'Express.js Framework',
            description: 'Building web servers with Express',
            content: '# Express.js Framework\n\nExpress is a minimal and flexible Node.js web application framework.',
            duration: 28,
            videoUrl: 'https://example.com/video11',
            order: 2,
            status: 'not_started',
            contentType: 'link'
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

// Activity log mock data
const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    actor: 'user',
    actionType: 'enroll',
    entityType: 'course',
    entityId: '1',
    entityName: 'React Fundamentals',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    actor: 'user',
    actionType: 'complete',
    entityType: 'lesson',
    entityId: 'l1',
    entityName: 'What is React?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

function getChatbotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  const responses: Record<string, string> = {
    hello: 'Hello! Welcome to Sikai Verse. How can I help you today?',
    hi: 'Hi there! 👋 What would you like to learn about?',
    'how are you': 'I\'m doing great, thanks for asking! How can I assist you?',
    help: 'I can help you with course recommendations, learning paths, and more. What interests you?',
    courses: 'We offer courses in Web Development, Programming, Design, and Backend Development. Would you like to explore any of these?',
    'react': 'React is a popular JavaScript library for building user interfaces. We have a great "React Fundamentals" course that might interest you!',
    'typescript': 'TypeScript adds static typing to JavaScript. Check out our "Advanced TypeScript" course for mastery!',
    'design': 'Our "Web Design Masterclass" covers responsive design, UI/UX principles, and modern design tools.',
    'backend': 'Interested in backend development? Try our "Node.js Backend Development" course!',
  }

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }

  return 'That\'s interesting! I\'m here to help with course recommendations and learning guidance. What would you like to explore?'
}

// Mock discussion data
const mockDiscussions = {
  '1': [
    {
      id: 'post-1',
      courseId: '1',
      userId: 'student-1',
      userName: 'John Doe',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student-1',
      title: 'How to set up React with TypeScript?',
      content: 'I\'m new to TypeScript and struggling with the setup. Can anyone guide me through the process?',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      replies: [
        {
          id: 'reply-1',
          postId: 'post-1',
          userId: 'student-2',
          userName: 'Jane Smith',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student-2',
          content: 'Check out the official React TypeScript documentation. It has great examples!',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 3,
        },
      ],
    },
    {
      id: 'post-2',
      courseId: '1',
      userId: 'student-2',
      userName: 'Jane Smith',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student-2',
      title: 'Best practices for component structure',
      content: 'What are your thoughts on organizing large React projects? Any recommendations?',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      replies: [],
    },
  ],
  '2': [
    {
      id: 'post-3',
      courseId: '2',
      userId: 'student-1',
      userName: 'John Doe',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student-1',
      title: 'UI Design Principles',
      content: 'Can someone explain the importance of whitespace in UI design?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      replies: [
        {
          id: 'reply-2',
          postId: 'post-3',
          userId: 'admin-1',
          userName: 'Admin User',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-1',
          content: 'Great question! Whitespace improves readability and user experience. It helps guide the eye and reduces cognitive load.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 10,
        },
      ],
    },
  ],
}

export const getDiscussionsByCoursId = async (courseId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockDiscussions[courseId as keyof typeof mockDiscussions] || []
}

export const addDiscussionPost = async (courseId: string, post: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const newPost = {
    ...post,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
  }
  if (!mockDiscussions[courseId as keyof typeof mockDiscussions]) {
    mockDiscussions[courseId as keyof typeof mockDiscussions] = []
  }
  mockDiscussions[courseId as keyof typeof mockDiscussions].push(newPost)
  return newPost
}

export const addDiscussionReply = async (courseId: string, postId: string, reply: any) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const posts = mockDiscussions[courseId as keyof typeof mockDiscussions]
  if (posts) {
    const post = posts.find(p => p.id === postId)
    if (post) {
      const newReply = {
        ...reply,
        id: Math.random().toString(36).substr(2, 9),
        postId,
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      post.replies.push(newReply)
      return newReply
    }
  }
  return null
}
