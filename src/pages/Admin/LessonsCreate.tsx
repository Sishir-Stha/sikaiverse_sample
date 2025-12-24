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

const lessonSchema = z.object({
  moduleId: z.string().min(1, 'Module ID required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  order: z.coerce.number().min(1, 'Order must be at least 1'),
})

type LessonFormData = z.infer<typeof lessonSchema>

export default function LessonsCreate() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
  })

  const onSubmit = async (data: LessonFormData) => {
    setIsLoading(true)
    try {
      await api.createLesson(data.moduleId, data)
      success('Lesson created successfully!')
      navigate('/admin')
    } catch (err) {
      error('Failed to create lesson')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Admin
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
            <CardDescription>Add a new lesson to a module</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Module ID</label>
                <Input
                  placeholder="e.g., m1"
                  {...register('moduleId')}
                  disabled={isLoading}
                />
                {errors.moduleId && <p className="text-destructive text-sm mt-1">{errors.moduleId.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Lesson Title</label>
                <Input
                  placeholder="e.g., What is React?"
                  {...register('title')}
                  disabled={isLoading}
                />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description</label>
                <textarea
                  placeholder="Describe the lesson..."
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Content</label>
                <textarea
                  placeholder="Lesson content..."
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('content')}
                  disabled={isLoading}
                />
                {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="e.g., 15"
                  {...register('duration')}
                  disabled={isLoading}
                />
                {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Order</label>
                <Input
                  type="number"
                  placeholder="e.g., 1"
                  {...register('order')}
                  disabled={isLoading}
                />
                {errors.order && <p className="text-destructive text-sm mt-1">{errors.order.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Lesson'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
