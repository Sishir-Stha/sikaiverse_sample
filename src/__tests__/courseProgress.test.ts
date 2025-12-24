import { describe, it, expect } from 'vitest'
import type { Course } from '../types'

/**
 * Test suite for course progress calculation
 */

const calculateCourseProgress = (course: Course): number => {
  let totalLessons = 0
  let completedLessons = 0
  course.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      totalLessons++
      if (lesson.status === 'completed') completedLessons++
    })
  })
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
}

describe('Course Progress Calculation', () => {
  it('should return 0 for course with no modules', () => {
    const course: Course = {
      id: '1',
      title: 'Test Course',
      description: 'Test',
      instructor: 'Test',
      category: 'Test',
      level: 'beginner',
      duration: 10,
      students: 0,
      rating: 0,
      image: '',
      modules: [],
      createdAt: new Date().toISOString(),
    }
    expect(calculateCourseProgress(course)).toBe(0)
  })

  it('should calculate progress correctly with mixed lesson statuses', () => {
    const course: Course = {
      id: '1',
      title: 'Test Course',
      description: 'Test',
      instructor: 'Test',
      category: 'Test',
      level: 'beginner',
      duration: 10,
      students: 0,
      rating: 0,
      image: '',
      modules: [
        {
          id: 'm1',
          courseId: '1',
          title: 'Module 1',
          description: 'Test',
          order: 1,
          lessons: [
            {
              id: 'l1',
              moduleId: 'm1',
              title: 'Lesson 1',
              description: 'Test',
              content: 'Test',
              duration: 10,
              order: 1,
              status: 'completed',
            },
            {
              id: 'l2',
              moduleId: 'm1',
              title: 'Lesson 2',
              description: 'Test',
              content: 'Test',
              duration: 10,
              order: 2,
              status: 'not_started',
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    }
    expect(calculateCourseProgress(course)).toBe(50)
  })

  it('should return 100 for fully completed course', () => {
    const course: Course = {
      id: '1',
      title: 'Test Course',
      description: 'Test',
      instructor: 'Test',
      category: 'Test',
      level: 'beginner',
      duration: 10,
      students: 0,
      rating: 0,
      image: '',
      modules: [
        {
          id: 'm1',
          courseId: '1',
          title: 'Module 1',
          description: 'Test',
          order: 1,
          lessons: [
            {
              id: 'l1',
              moduleId: 'm1',
              title: 'Lesson 1',
              description: 'Test',
              content: 'Test',
              duration: 10,
              order: 1,
              status: 'completed',
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    }
    expect(calculateCourseProgress(course)).toBe(100)
  })
})
