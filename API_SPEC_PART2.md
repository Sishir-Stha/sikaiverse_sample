# Sikai Verse - REST API Specification (Part 2)

## COURSE MANAGEMENT ENDPOINTS

### 1. Get All Courses
**GET** `/api/courses`

**Query:** `?page=1&limit=12&category=Programming&level=beginner&search=React&sortBy=rating`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "course-1",
      "title": "Introduction to React",
      "description": "Learn React from basics to advanced",
      "instructor": "Jane Smith",
      "instructorId": "user-456",
      "category": "Programming",
      "level": "beginner",
      "duration": 240,
      "students": 1250,
      "rating": 4.8,
      "image": "https://api.example.com/images/course-1.jpg",
      "status": "published",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

### 2. Get Course by ID
**GET** `/api/courses/{courseId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "course-1",
    "title": "Introduction to React",
    "description": "Learn React from basics to advanced",
    "instructor": "Jane Smith",
    "instructorId": "user-456",
    "category": "Programming",
    "level": "beginner",
    "duration": 240,
    "students": 1250,
    "rating": 4.8,
    "image": "https://api.example.com/images/course-1.jpg",
    "status": "published",
    "modules": [
      {
        "id": "module-1",
        "title": "Getting Started",
        "description": "Introduction to React basics",
        "order": 1,
        "lessons": [
          {
            "id": "lesson-1",
            "title": "What is React?",
            "description": "Understanding React fundamentals",
            "contentType": "video",
            "videoUrl": "https://youtube.com/watch?v=...",
            "duration": 15,
            "order": 1,
            "status": "published"
          }
        ]
      }
    ],
    "createdAt": "2024-01-10T10:00:00Z"
  }
}
```

### 3. Create Course (Admin)
**POST** `/api/courses`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts",
  "category": "Programming",
  "level": "advanced",
  "duration": 300,
  "image": "https://api.example.com/images/course-new.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "course-new",
    "title": "Advanced JavaScript",
    "description": "Master advanced JavaScript concepts",
    "instructor": "Admin User",
    "instructorId": "user-123",
    "category": "Programming",
    "level": "advanced",
    "duration": 300,
    "students": 0,
    "rating": 0,
    "image": "https://api.example.com/images/course-new.jpg",
    "status": "draft",
    "modules": [],
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 4. Update Course (Admin)
**PUT** `/api/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Advanced JavaScript Mastery",
  "description": "Master advanced JavaScript concepts and patterns",
  "category": "Programming",
  "level": "advanced",
  "duration": 320,
  "status": "published"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "course-new",
    "title": "Advanced JavaScript Mastery",
    "description": "Master advanced JavaScript concepts and patterns",
    "category": "Programming",
    "level": "advanced",
    "duration": 320,
    "status": "published",
    "updatedAt": "2024-01-20T16:30:00Z"
  }
}
```

### 5. Delete Course (Admin)
**DELETE** `/api/courses/{courseId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### 6. Upload Course Image
**POST** `/api/courses/{courseId}/image`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request:** `file: [binary image file]`

**Response (200):**
```json
{
  "success": true,
  "message": "Course image uploaded successfully",
  "data": {
    "image": "https://api.example.com/uploads/courses/course-1.jpg"
  }
}
```

### 7. Publish Course (Admin)
**POST** `/api/courses/{courseId}/publish`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Course published successfully",
  "data": {
    "id": "course-1",
    "status": "published",
    "publishedAt": "2024-01-20T16:45:00Z"
  }
}
```

### 8. Archive Course (Admin)
**POST** `/api/courses/{courseId}/archive`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Course archived successfully",
  "data": {
    "id": "course-1",
    "status": "archived"
  }
}
```

---

## MODULE MANAGEMENT ENDPOINTS

### 1. Create Module (Admin)
**POST** `/api/courses/{courseId}/modules`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Getting Started",
  "description": "Introduction to React basics",
  "order": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "id": "module-1",
    "courseId": "course-1",
    "title": "Getting Started",
    "description": "Introduction to React basics",
    "order": 1,
    "status": "draft",
    "lessons": [],
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 2. Get Module by ID
**GET** `/api/modules/{moduleId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "module-1",
    "courseId": "course-1",
    "title": "Getting Started",
    "description": "Introduction to React basics",
    "order": 1,
    "status": "draft",
    "lessons": [
      {
        "id": "lesson-1",
        "title": "What is React?",
        "description": "Understanding React fundamentals",
        "contentType": "video",
        "videoUrl": "https://youtube.com/watch?v=...",
        "duration": 15,
        "order": 1,
        "status": "published"
      }
    ],
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 3. Update Module (Admin)
**PUT** `/api/modules/{moduleId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Getting Started with React",
  "description": "Complete introduction to React basics",
  "order": 1,
  "status": "published"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Module updated successfully",
  "data": {
    "id": "module-1",
    "title": "Getting Started with React",
    "description": "Complete introduction to React basics",
    "order": 1,
    "status": "published",
    "updatedAt": "2024-01-20T16:30:00Z"
  }
}
```

### 4. Delete Module (Admin)
**DELETE** `/api/modules/{moduleId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

### 5. Reorder Modules (Admin)
**POST** `/api/courses/{courseId}/modules/reorder`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "modules": [
    { "id": "module-1", "order": 1 },
    { "id": "module-2", "order": 2 },
    { "id": "module-3", "order": 3 }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Modules reordered successfully"
}
```

---

## LESSON MANAGEMENT ENDPOINTS

### 1. Create Lesson (Admin)
**POST** `/api/modules/{moduleId}/lessons`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request:**
```
title: "What is React?"
description: "Understanding React fundamentals"
contentType: "video"
videoUrl: "https://youtube.com/watch?v=..."
duration: 15
order: 1
file: [optional binary file for document/photo]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson-1",
    "moduleId": "module-1",
    "title": "What is React?",
    "description": "Understanding React fundamentals",
    "contentType": "video",
    "videoUrl": "https://youtube.com/watch?v=...",
    "duration": 15,
    "order": 1,
    "status": "draft",
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 2. Get Lesson by ID
**GET** `/api/lessons/{lessonId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "lesson-1",
    "moduleId": "module-1",
    "title": "What is React?",
    "description": "Understanding React fundamentals",
    "contentType": "video",
    "content": "Main lesson content",
    "videoUrl": "https://youtube.com/watch?v=...",
    "documentUrl": null,
    "photoUrl": null,
    "externalLink": null,
    "duration": 15,
    "order": 1,
    "status": "published",
    "createdAt": "2024-01-20T16:00:00Z"
  }
}
```

### 3. Update Lesson (Admin)
**PUT** `/api/lessons/{lessonId}`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request:**
```
title: "What is React? - Updated"
description: "Complete understanding of React fundamentals"
contentType: "video"
videoUrl: "https://youtube.com/watch?v=..."
duration: 20
order: 1
status: "published"
file: [optional binary file to replace]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "id": "lesson-1",
    "title": "What is React? - Updated",
    "description": "Complete understanding of React fundamentals",
    "contentType": "video",
    "duration": 20,
    "status": "published",
    "updatedAt": "2024-01-20T16:30:00Z"
  }
}
```

### 4. Delete Lesson (Admin)
**DELETE** `/api/lessons/{lessonId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Lesson deleted successfully"
}
```

### 5. Reorder Lessons (Admin)
**POST** `/api/modules/{moduleId}/lessons/reorder`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "lessons": [
    { "id": "lesson-1", "order": 1 },
    { "id": "lesson-2", "order": 2 },
    { "id": "lesson-3", "order": 3 }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lessons reordered successfully"
}
```

### 6. Upload Lesson File
**POST** `/api/lessons/{lessonId}/file`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request:**
```
file: [binary file]
contentType: "document" | "video" | "photo"
```

**Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileUrl": "https://api.example.com/uploads/lessons/lesson-1.pdf",
    "fileName": "lesson-1.pdf",
    "fileSize": 2048576
  }
}
```

---

## ENROLLMENT ENDPOINTS

### 1. Enroll in Course
**POST** `/api/enrollments`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "courseId": "course-1"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Enrolled in course successfully",
  "data": {
    "id": "enrollment-1",
    "userId": "user-123",
    "courseId": "course-1",
    "status": "active",
    "progressPercentage": 0,
    "enrolledAt": "2024-01-20T16:00:00Z"
  }
}
```

### 2. Get User Enrollments
**GET** `/api/enrollments`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?status=active&sortBy=enrolledAt&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-1",
      "userId": "user-123",
      "courseId": "course-1",
      "courseName": "Introduction to React",
      "courseImage": "https://api.example.com/images/course-1.jpg",
      "status": "active",
      "progressPercentage": 45,
      "enrolledAt": "2024-01-15T10:00:00Z",
      "completedAt": null
    }
  ]
}
```

### 3. Get Course Enrollments (Admin)
**GET** `/api/courses/{courseId}/enrollments`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?page=1&limit=20&status=active`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-1",
      "userId": "user-123",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "status": "active",
      "progressPercentage": 45,
      "enrolledAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 4. Unenroll from Course
**DELETE** `/api/enrollments/{enrollmentId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Unenrolled from course successfully"
}
```

### 5. Get Enrollment Details
**GET** `/api/enrollments/{enrollmentId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "enrollment-1",
    "userId": "user-123",
    "courseId": "course-1",
    "courseName": "Introduction to React",
    "status": "active",
    "progressPercentage": 45,
    "enrolledAt": "2024-01-15T10:00:00Z",
    "completedAt": null,
    "completedLessons": ["lesson-1", "lesson-2", "lesson-3"]
  }
}
```
