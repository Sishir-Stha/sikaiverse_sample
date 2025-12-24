import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import { useToast } from '../../hooks/use-toast'
import type { Course, DiscussionPost, DiscussionReply } from '../../types'
import { ArrowLeft, MessageCircle, Send, Edit2, Trash2, Heart } from 'lucide-react'
import { getDiscussionsByCoursId, addDiscussionReply } from '../../lib/api'

export default function AdminDiscussionsPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null)
  const [adminReplyContent, setAdminReplyContent] = useState('')

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses()
        setCourses(data)
      } catch (err) {
        console.error('Failed to load courses:', err)
        error('Failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [error])

  const handleSelectCourse = async (courseId: string) => {
    setSelectedCourseId(courseId)
    try {
      const data = await getDiscussionsByCoursId(courseId)
      setDiscussions(data)
    } catch (err) {
      console.error('Failed to load discussions:', err)
      error('Failed to load discussions')
    }
  }

  const handleAdminReply = async (postId: string) => {
    if (!adminReplyContent.trim() || !selectedCourseId) return

    try {
      const reply = await addDiscussionReply(selectedCourseId, postId, {
        userId: 'admin-1',
        userName: 'Admin',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        content: adminReplyContent,
      })

      if (reply) {
        setDiscussions(
          discussions.map(p =>
            p.id === postId
              ? { ...p, replies: [...p.replies, { ...reply, isAdmin: true }] }
              : p
          )
        )
        setAdminReplyContent('')
        setReplyingToPostId(null)
        success('Admin reply posted successfully!')
      }
    } catch (err) {
      console.error('Failed to post reply:', err)
      error('Failed to post reply')
    }
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading discussions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle size={32} className="text-primary" />
            <h1 className="text-4xl font-bold">Discussion Management</h1>
          </div>
          <p className="text-muted-foreground">Manage course discussions and respond to student questions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Course List Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Courses</CardTitle>
                <CardDescription>Select a course to view discussions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search */}
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="mb-4"
                />

                {/* Course List */}
                {filteredCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No courses found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => handleSelectCourse(course.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedCourseId === course.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary hover:bg-muted'
                        }`}
                      >
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Discussions View */}
          <div className="md:col-span-2">
            {!selectedCourseId ? (
              <Card>
                <CardContent className="pt-12 text-center pb-12">
                  <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">Select a course to view discussions</p>
                  <p className="text-sm text-muted-foreground">Choose a course from the list on the left</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Course Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {courses.find(c => c.id === selectedCourseId)?.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {discussions.length} discussion{discussions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourseId(null)}
                    className="gap-2"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </Button>
                </div>

                {/* Discussions List */}
                {discussions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-12 text-center pb-12">
                      <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No discussions yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {discussions.map(post => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {post.userAvatar && (
                                  <img src={post.userAvatar} alt={post.userName} className="w-8 h-8 rounded-full" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{post.userName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Heart size={18} />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-foreground">{post.content}</p>

                          {/* Replies */}
                          {post.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-border space-y-3">
                              {post.replies.map(reply => (
                                <div key={reply.id} className="text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    {reply.userAvatar && (
                                      <img src={reply.userAvatar} alt={reply.userName} className="w-6 h-6 rounded-full" />
                                    )}
                                    <p className="font-medium">{reply.userName}</p>
                                    {reply.userId === 'admin-1' && (
                                      <Badge variant="default" className="text-xs">Admin</Badge>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Admin Reply Form */}
                          {replyingToPostId === post.id ? (
                            <div className="mt-4 space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
                              <p className="text-sm font-medium">Post Admin Reply</p>
                              <textarea
                                placeholder="Write your admin response..."
                                value={adminReplyContent}
                                onChange={e => setAdminReplyContent(e.target.value)}
                                className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm min-h-20"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAdminReply(post.id)}
                                  disabled={!adminReplyContent.trim()}
                                  className="gap-2"
                                >
                                  <Send size={16} />
                                  Post Reply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setReplyingToPostId(null)
                                    setAdminReplyContent('')
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReplyingToPostId(post.id)}
                              className="gap-2"
                            >
                              <Send size={16} />
                              Reply as Admin
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
