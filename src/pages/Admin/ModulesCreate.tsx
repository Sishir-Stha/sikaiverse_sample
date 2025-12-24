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

const moduleSchema = z.object({
  courseId: z.string().min(1, 'Course ID required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  order: z.coerce.number().min(1, 'Order must be at least 1'),
})

type ModuleFormData = z.infer<typeof moduleSchema>

export default function ModulesCreate() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
  })

  const onSubmit = async (data: ModuleFormData) => {
    setIsLoading(true)
    try {
      await api.createModule(data.courseId, data)
      success('Module created successfully!')
      navigate('/admin')
    } catch (err) {
      error('Failed to create module')
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
            <CardTitle>Create New Module</CardTitle>
            <CardDescription>Add a new module to a course</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Course ID</label>
                <Input
                  placeholder="e.g., 1"
                  {...register('courseId')}
                  disabled={isLoading}
                />
                {errors.courseId && <p className="text-destructive text-sm mt-1">{errors.courseId.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Module Title</label>
                <Input
                  placeholder="e.g., Getting Started"
                  {...register('title')}
                  disabled={isLoading}
                />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description</label>
                <textarea
                  placeholder="Describe the module..."
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
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
                {isLoading ? 'Creating...' : 'Create Module'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
