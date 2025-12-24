import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/use-toast'
import { getDiscussionsByCoursId, addDiscussionPost, addDiscussionReply } from '../../lib/api'
import type { DiscussionPost } from '../../types'
import { MessageCircle, Heart, Reply, Send } from 'lucide-react'

export default function DiscussionForumPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const { success } = useToast()
  const [posts, setPosts] = useState<DiscussionPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    const loadDiscussions = async () => {
      if (!courseId) return
      try {
        const data = await getDiscussionsByCoursId(courseId)
        setPosts(data)
      } catch (error) {
        console.error('Failed to load discussions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDiscussions()
  }, [courseId])

  const handlePostQuestion = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !user) return

    try {
      const newPost = await addDiscussionPost(courseId!, {
        courseId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        title: newPostTitle,
        content: newPostContent,
      })

      setPosts([newPost, ...posts])
      setNewPostTitle('')
      setNewPostContent('')
      success('Question posted successfully!')
    } catch (error) {
      console.error('Failed to post question:', error)
    }
  }

  const handleReply = async (postId: string) => {
    if (!replyContent.trim() || !user) return

    try {
      const reply = await addDiscussionReply(courseId!, postId, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: replyContent,
      })

      if (reply) {
        setPosts(posts.map(p =>
          p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
        ))
        setReplyContent('')
        setReplyingTo(null)
        success('Reply posted successfully!')
      }
    } catch (error) {
      console.error('Failed to post reply:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle size={32} className="text-primary" />
            <h1 className="text-4xl font-bold">Discussion Forum</h1>
          </div>
          <p className="text-muted-foreground">Ask questions, share insights, and connect with fellow learners</p>
        </div>

        {/* New Post Form */}
        {user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Question title..."
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
              />
              <textarea
                placeholder="Describe your question or topic..."
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground min-h-24"
              />
              <Button
                onClick={handlePostQuestion}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                className="gap-2"
              >
                <Send size={18} />
                Post Question
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        {isLoading ? (
          <p className="text-muted-foreground text-center">Loading discussions...</p>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No discussions yet. Be the first to start one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
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
                            <p className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-muted-foreground">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {user && (
                    <>
                      {replyingTo === post.id ? (
                        <div className="mt-4 space-y-2">
                          <textarea
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm min-h-16"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReply(post.id)}
                              disabled={!replyContent.trim()}
                            >
                              Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyContent('')
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
                          onClick={() => setReplyingTo(post.id)}
                          className="gap-2"
                        >
                          <Reply size={16} />
                          Reply
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
