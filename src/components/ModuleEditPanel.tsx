import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X } from 'lucide-react'
import type { Module, Lesson } from '../types'

interface ModuleEditPanelProps {
  isOpen: boolean
  onClose: () => void
  module?: Module | null
  onSave: (data: Partial<Module>) => void
  onAddLesson?: (moduleId: string, lesson: Partial<Lesson>) => void
  isLoading?: boolean
}

export default function ModuleEditPanel({
  isOpen,
  onClose,
  module,
  onSave,
  onAddLesson,
  isLoading = false,
}: ModuleEditPanelProps) {
  const [title, setTitle] = useState(module?.title || '')
  const [description, setDescription] = useState(module?.description || '')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDuration, setLessonDuration] = useState('30')
  const [showLessonForm, setShowLessonForm] = useState(false)

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, description })
    onClose()
  }

  const handleAddLesson = () => {
    if (!lessonTitle.trim() || !module) return
    onAddLesson?.(module.id, {
      title: lessonTitle,
      duration: parseInt(lessonDuration),
      description: '',
      content: '',
      order: module.lessons.length + 1,
    })
    setLessonTitle('')
    setLessonDuration('30')
    setShowLessonForm(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed left-0 top-0 h-full w-96 bg-background border-r border-border shadow-lg z-50 overflow-y-auto transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {module ? 'Edit Module' : 'Add Module'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Module Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Module Title</label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter module title"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter module description"
                className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm min-h-20 mt-1"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!title.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Module'}
            </Button>
          </div>

          {/* Lessons Section */}
          {module && (
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Lessons ({module.lessons.length})</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLessonForm(!showLessonForm)}
                >
                  {showLessonForm ? 'Cancel' : '+ Add Lesson'}
                </Button>
              </div>

              {/* Add Lesson Form */}
              {showLessonForm && (
                <Card className="mb-4 bg-muted/50">
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium">Lesson Title</label>
                      <Input
                        value={lessonTitle}
                        onChange={e => setLessonTitle(e.target.value)}
                        placeholder="Enter lesson title"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Duration (minutes)</label>
                      <Input
                        type="number"
                        value={lessonDuration}
                        onChange={e => setLessonDuration(e.target.value)}
                        min="1"
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleAddLesson}
                      disabled={!lessonTitle.trim()}
                      size="sm"
                      className="w-full"
                    >
                      Add Lesson
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Lessons List */}
              <div className="space-y-2">
                {module.lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No lessons yet
                  </p>
                ) : (
                  module.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm">{idx + 1}. {lesson.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lesson.duration} min
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
