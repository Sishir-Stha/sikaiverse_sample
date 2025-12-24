import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructor: z.string().min(2, 'Instructor name required'),
  category: z.string().min(2, 'Category required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 hour'),
})

type CourseFormData = z.infer<typeof courseSchema>

export default function CoursesCreate() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  })

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true)
    try {
      await api.createCourse(data)
      success('Course created successfully!')
      navigate('/admin')
    } catch (err) {
      error('Failed to create course')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-primary hover:underline mb-6 transition-all duration-200 hover:gap-3 animate-fade-in-up"
        >
          <ArrowLeft size={20} />
          Back to Admin
        </button>

        <Card className="card-enhanced animate-fade-in-up">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Add a new course to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Title */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="text-sm font-medium text-foreground block mb-2">Course Title</label>
                <Input
                  placeholder="e.g., React Fundamentals"
                  {...register('title')}
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="text-sm font-medium text-foreground block mb-2">Description</label>
                <textarea
                  placeholder="Describe the course..."
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Instructor Name */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="text-sm font-medium text-foreground block mb-2">Instructor Name</label>
                  <Input
                    placeholder="e.g., Sarah Chen"
                    {...register('instructor')}
                    disabled={isLoading}
                    className="transition-all duration-200"
                  />
                  {errors.instructor && <p className="text-destructive text-sm mt-1">{errors.instructor.message}</p>}
                </div>

                {/* Category */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="text-sm font-medium text-foreground block mb-2">Category</label>
                  <Input
                    placeholder="e.g., Web Development"
                    {...register('category')}
                    disabled={isLoading}
                    className="transition-all duration-200"
                  />
                  {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Level */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <label className="text-sm font-medium text-foreground block mb-2">Level</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    {...register('level')}
                    disabled={isLoading}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.level && <p className="text-destructive text-sm mt-1">{errors.level.message}</p>}
                </div>

                {/* Duration */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <label className="text-sm font-medium text-foreground block mb-2">Duration (hours)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 40"
                    {...register('duration')}
                    disabled={isLoading}
                    className="transition-all duration-200"
                  />
                  {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up pt-4" style={{ animationDelay: '0.7s' }}>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 h-10" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
