import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { api } from '../../lib/api'
import { useChatbot } from '../../context/ChatbotContext'
import TopBar from '../../components/TopBar'
import type { Course } from '../../types'
import {
  Palette,
  Briefcase,
  BarChart3,
  Code,
  Heart,
  Monitor,
  Globe,
  Calculator,
  Users,
  Star,
  HelpCircle,
  ArrowUpRight,
  ArrowRight,
  X,
  BookOpen,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Arts and Humanities': <Palette size={18} />,
  'Business': <Briefcase size={18} />,
  'Data Science': <BarChart3 size={18} />,
  'Computer Science': <Code size={18} />,
  'Health': <Heart size={18} />,
  'Information Technology': <Monitor size={18} />,
  'Language Learning': <Globe size={18} />,
  'Math and Logic': <Calculator size={18} />,
  'Personal Development': <Users size={18} />,
}

export default function BrowseCoursesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { openChatbot } = useChatbot()

  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPopularFilter, setSelectedPopularFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true) // Always show on load

  // Extract unique categories from courses
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses()
        setCourses(data)
        setFilteredCourses(data)
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(c => c.category)))
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Failed to load courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  useEffect(() => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Apply popular filter
    if (selectedPopularFilter !== 'All') {
      filtered = filtered.filter(c => c.category === selectedPopularFilter)
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, selectedPopularFilter, courses])

  const handleCloseBanner = () => {
    setBannerVisible(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="pt-12 pb-8">
          <h1 className="text-5xl font-bold">Explore Categories</h1>
        </div>

        {/* Category Filter Chips */}
        <div className="pb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {CATEGORY_ICONS[category] || <BookOpen size={18} />}
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Banner */}
        {bannerVisible && (
          <div className="mb-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 flex items-center gap-4 border border-blue-200 dark:border-blue-800 relative">
            <div className="flex-shrink-0">
              <HelpCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-gray-100">
                Need help? Tell me a little about yourself so I can make the best recommendations.
              </p>
            </div>
            <button
              onClick={openChatbot}
              className="flex-shrink-0 text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Set your goal
              <ArrowUpRight size={16} />
            </button>
            <button
              onClick={handleCloseBanner}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close banner"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Courses Grid */}
        <div className="mb-12">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No courses found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                  setSelectedPopularFilter('All')
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/course-details/${course.id}`)}
                  className="text-left"
                >
                  <Card
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-103 flex flex-col border border-gray-200 dark:border-gray-700 cursor-pointer card-enhanced"
                  >
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover image-hover-zoom"
                    />
                    {/* Free Trial Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white text-gray-900 hover:bg-gray-100">Free Trial</Badge>
                    </div>
                  </div>

                  <CardContent className="flex-1 flex flex-col p-4">
                    {/* Provider Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {course.instructor.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.instructor}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 text-base">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                      {course.description}
                    </p>

                    {/* Rating and Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(`/course-details/${course.id}`)}
                      className="w-full"
                    >
                      <Button className="w-full gap-2">
                        Explore
                        <ArrowRight size={16} />
                      </Button>
                    </button>
                  </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-card border-t border-border py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Sign up today and get access to all our courses. Learn at your own pace, anytime, anywhere.
          </p>
          <Link to="/login">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
