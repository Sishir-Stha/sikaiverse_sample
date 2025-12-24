# Sikai Verse - REST API Specification (Part 3)

## PROGRESS TRACKING ENDPOINTS

### 1. Mark Lesson as Complete
**POST** `/api/progress/lessons/{lessonId}/complete`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "timeSpent": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lesson marked as complete",
  "data": {
    "lessonId": "lesson-1",
    "userId": "user-123",
    "status": "completed",
    "completedAt": "2024-01-20T16:30:00Z",
    "timeSpentMinutes": 15
  }
}
```

### 2. Get Lesson Progress
**GET** `/api/progress/lessons/{lessonId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson-1",
    "userId": "user-123",
    "status": "completed",
    "startedAt": "2024-01-20T16:15:00Z",
    "completedAt": "2024-01-20T16:30:00Z",
    "timeSpentMinutes": 15
  }
}
```

### 3. Get Course Progress
**GET** `/api/progress/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courseId": "course-1",
    "userId": "user-123",
    "progressPercentage": 45,
    "totalLessons": 20,
    "completedLessons": 9,
    "inProgressLessons": 2,
    "notStartedLessons": 9,
    "modules": [
      {
        "moduleId": "module-1",
        "title": "Getting Started",
        "progressPercentage": 100,
        "lessons": [
          {
            "lessonId": "lesson-1",
            "title": "What is React?",
            "status": "completed"
          }
        ]
      }
    ]
  }
}
```

### 4. Update Lesson Progress
**PUT** `/api/progress/lessons/{lessonId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "status": "in_progress",
  "timeSpent": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lesson progress updated",
  "data": {
    "lessonId": "lesson-1",
    "status": "in_progress",
    "timeSpentMinutes": 5
  }
}
```

### 5. Get User Learning Analytics
**GET** `/api/progress/analytics`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?courseId=course-1&period=month`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCoursesEnrolled": 5,
    "totalCoursesCompleted": 2,
    "totalLessonsCompleted": 45,
    "totalStudyTime": 1200,
    "averageCompletionRate": 65,
    "streakDays": 7,
    "recentActivity": [
      {
        "date": "2024-01-20",
        "lessonsCompleted": 3,
        "timeSpent": 120
      }
    ]
  }
}
```

---

## DISCUSSION FORUM ENDPOINTS

### 1. Get Course Discussions
**GET** `/api/courses/{courseId}/discussions`

**Query:** `?page=1&limit=10&sortBy=createdAt&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "post-1",
      "courseId": "course-1",
      "userId": "user-123",
      "userName": "John Doe",
      "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
      "title": "How to use React hooks?",
      "content": "I'm confused about how to use React hooks in my project...",
      "likes": 5,
      "replies": 3,
      "createdAt": "2024-01-20T15:00:00Z",
      "updatedAt": "2024-01-20T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 2. Create Discussion Post
**POST** `/api/courses/{courseId}/discussions`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "How to use React hooks?",
  "content": "I'm confused about how to use React hooks in my project..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Discussion post created successfully",
  "data": {
    "id": "post-1",
    "courseId": "course-1",
    "userId": "user-123",
    "userName": "John Doe",
    "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "title": "How to use React hooks?",
    "content": "I'm confused about how to use React hooks in my project...",
    "likes": 0,
    "replies": [],
    "createdAt": "2024-01-20T15:00:00Z"
  }
}
```

### 3. Get Discussion Post
**GET** `/api/discussions/{postId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "post-1",
    "courseId": "course-1",
    "userId": "user-123",
    "userName": "John Doe",
    "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "title": "How to use React hooks?",
    "content": "I'm confused about how to use React hooks in my project...",
    "likes": 5,
    "createdAt": "2024-01-20T15:00:00Z",
    "replies": [
      {
        "id": "reply-1",
        "postId": "post-1",
        "userId": "user-456",
        "userName": "Jane Smith",
        "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com",
        "content": "You can use useState hook for state management...",
        "likes": 2,
        "isAdminReply": false,
        "createdAt": "2024-01-20T15:30:00Z"
      }
    ]
  }
}
```

### 4. Update Discussion Post
**PUT** `/api/discussions/{postId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "How to use React hooks? (Updated)",
  "content": "I'm still confused about how to use React hooks..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Discussion post updated successfully",
  "data": {
    "id": "post-1",
    "title": "How to use React hooks? (Updated)",
    "content": "I'm still confused about how to use React hooks...",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### 5. Delete Discussion Post
**DELETE** `/api/discussions/{postId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Discussion post deleted successfully"
}
```

### 6. Like Discussion Post
**POST** `/api/discussions/{postId}/like`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "postId": "post-1",
    "likes": 6
  }
}
```

### 7. Unlike Discussion Post
**DELETE** `/api/discussions/{postId}/like`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Post unliked successfully",
  "data": {
    "postId": "post-1",
    "likes": 5
  }
}
```

### 8. Add Discussion Reply
**POST** `/api/discussions/{postId}/replies`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "content": "You can use useState hook for state management..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Reply posted successfully",
  "data": {
    "id": "reply-1",
    "postId": "post-1",
    "userId": "user-456",
    "userName": "Jane Smith",
    "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com",
    "content": "You can use useState hook for state management...",
    "likes": 0,
    "isAdminReply": false,
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

### 9. Update Discussion Reply
**PUT** `/api/discussions/{postId}/replies/{replyId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "content": "You can use useState hook for state management... (Updated)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reply updated successfully",
  "data": {
    "id": "reply-1",
    "content": "You can use useState hook for state management... (Updated)",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

### 10. Delete Discussion Reply
**DELETE** `/api/discussions/{postId}/replies/{replyId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Reply deleted successfully"
}
```

### 11. Like Discussion Reply
**POST** `/api/discussions/{postId}/replies/{replyId}/like`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Reply liked successfully",
  "data": {
    "replyId": "reply-1",
    "likes": 1
  }
}
```

---

## ADMIN ENDPOINTS

### 1. Get Admin Dashboard Stats
**GET** `/api/admin/stats`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalCourses": 45,
    "totalEnrollments": 3500,
    "activeUsers": 850,
    "newUsersThisMonth": 120,
    "totalRevenue": 45000,
    "averageRating": 4.6,
    "topCourses": [
      {
        "id": "course-1",
        "title": "Introduction to React",
        "enrollments": 500,
        "rating": 4.8
      }
    ]
  }
}
```

### 2. Get Activity Logs
**GET** `/api/admin/activity-logs`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?page=1&limit=50&actionType=create&entityType=course&sortBy=createdAt`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-1",
      "actorId": "user-123",
      "actorName": "John Doe",
      "actionType": "create",
      "entityType": "course",
      "entityId": "course-1",
      "entityName": "Introduction to React",
      "description": "Created new course",
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-20T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1200,
    "totalPages": 24
  }
}
```

### 3. Get User Reports
**GET** `/api/admin/reports/users`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?period=month&sortBy=enrollments&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 850,
    "inactiveUsers": 400,
    "newUsersThisMonth": 120,
    "usersByRole": {
      "student": 1100,
      "admin": 50,
      "instructor": 100
    },
    "usersByStatus": {
      "active": 850,
      "inactive": 400
    },
    "topUsers": [
      {
        "id": "user-123",
        "name": "John Doe",
        "email": "john@example.com",
        "enrollments": 10,
        "completedCourses": 5,
        "lastLogin": "2024-01-20T15:00:00Z"
      }
    ]
  }
}
```

### 4. Get Course Reports
**GET** `/api/admin/reports/courses`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?period=month&sortBy=enrollments&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCourses": 45,
    "publishedCourses": 40,
    "draftCourses": 5,
    "archivedCourses": 0,
    "totalEnrollments": 3500,
    "averageRating": 4.6,
    "topCourses": [
      {
        "id": "course-1",
        "title": "Introduction to React",
        "instructor": "Jane Smith",
        "enrollments": 500,
        "rating": 4.8,
        "completionRate": 75
      }
    ]
  }
}
```

### 5. Send Bulk Email
**POST** `/api/admin/email/bulk`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "recipients": ["user-1", "user-2", "user-3"],
  "subject": "New Course Available",
  "body": "We have a new course available for you...",
  "templateId": "template-1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "data": {
    "sentCount": 3,
    "failedCount": 0
  }
}
```

### 6. Export User Data
**GET** `/api/admin/export/users`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?format=csv&role=student`

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="users.csv"

id,name,email,role,status,enrolledCourses,createdAt
user-123,John Doe,john@example.com,student,active,5,2024-01-15T10:30:00Z
```

### 7. Export Course Data
**GET** `/api/admin/export/courses`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?format=csv&status=published`

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="courses.csv"

id,title,instructor,category,level,enrollments,rating,status,createdAt
course-1,Introduction to React,Jane Smith,Programming,beginner,500,4.8,published,2024-01-10T10:00:00Z
```

---

## CHATBOT ENDPOINTS

### 1. Send Chatbot Message
**POST** `/api/chatbot/messages`

**Headers:** `Authorization: Bearer {token}` (optional)

**Request:**
```json
{
  "conversationId": "conv-123",
  "message": "How do I get started with React?",
  "sessionId": "session-456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "msg-1",
    "conversationId": "conv-123",
    "role": "assistant",
    "content": "React is a JavaScript library for building user interfaces...",
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 2. Get Chatbot Conversation
**GET** `/api/chatbot/conversations/{conversationId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "conv-123",
    "userId": "user-123",
    "sessionId": "session-456",
    "messages": [
      {
        "id": "msg-1",
        "role": "user",
        "content": "How do I get started with React?",
        "createdAt": "2024-01-20T15:59:00Z"
      },
      {
        "id": "msg-2",
        "role": "assistant",
        "content": "React is a JavaScript library for building user interfaces...",
        "createdAt": "2024-01-20T16:00:00Z"
      }
    ],
    "createdAt": "2024-01-20T15:59:00Z"
  }
}
```

### 3. Create New Chatbot Conversation
**POST** `/api/chatbot/conversations`

**Headers:** `Authorization: Bearer {token}` (optional)

**Request:**
```json
{
  "sessionId": "session-456"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Conversation created successfully",
  "data": {
    "id": "conv-123",
    "userId": "user-123",
    "sessionId": "session-456",
    "messages": [],
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 4. Get Chatbot Suggestions
**GET** `/api/chatbot/suggestions`

**Query:** `?topic=react&limit=5`

**Response (200):**
```json
{
  "success": true,
  "data": [
    "What is React?",
    "How do I use React hooks?",
    "What is JSX?",
    "How do I manage state in React?",
    "What are React components?"
  ]
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request",
  "errors": {
    "field_name": "Error message for this field"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Resource already exists",
  "code": "CONFLICT"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

---

## AUTHENTICATION

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token should be included in response from login/register endpoints and stored in localStorage.

---

## PAGINATION

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## SORTING

List endpoints support sorting:

**Query Parameters:**
- `sortBy`: Field to sort by
- `sortOrder`: "asc" or "desc" (default: "asc")

Example: `?sortBy=createdAt&sortOrder=desc`

---

## FILTERING

List endpoints support filtering by various fields:

**Common Filters:**
- `status`: Filter by status
- `role`: Filter by role
- `category`: Filter by category
- `level`: Filter by level
- `search`: Full-text search

Example: `?status=active&role=student&search=React`
