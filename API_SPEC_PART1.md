# Sikai Verse - REST API Specification (Part 1)

## DATABASE SCHEMA

### 1. Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  avatar VARCHAR(500),
  role ENUM('student', 'admin', 'instructor') DEFAULT 'student',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);
```

### 2. Courses Table
```sql
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id VARCHAR(36) NOT NULL,
  category VARCHAR(100),
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  duration INT DEFAULT 0,
  image VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_students INT DEFAULT 0,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_instructor_id (instructor_id),
  INDEX idx_category (category),
  INDEX idx_level (level),
  INDEX idx_status (status)
);
```

### 3. Modules Table
```sql
CREATE TABLE modules (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_position INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  UNIQUE KEY unique_course_order (course_id, order_position)
);
```

### 4. Lessons Table
```sql
CREATE TABLE lessons (
  id VARCHAR(36) PRIMARY KEY,
  module_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type ENUM('document', 'video', 'link', 'photo', 'message') NOT NULL,
  content TEXT,
  video_url VARCHAR(500),
  document_url VARCHAR(500),
  photo_url VARCHAR(500),
  external_link VARCHAR(500),
  duration INT DEFAULT 0,
  order_position INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_module_id (module_id),
  UNIQUE KEY unique_module_order (module_id, order_position)
);
```

### 5. Enrollments Table
```sql
CREATE TABLE enrollments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
  progress_percentage INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_course_id (course_id),
  UNIQUE KEY unique_enrollment (user_id, course_id)
);
```

### 6. Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  lesson_id VARCHAR(36) NOT NULL,
  status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_minutes INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id),
  UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);
```

### 7. Discussion Posts Table
```sql
CREATE TABLE discussion_posts (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  INDEX idx_user_id (user_id)
);
```

### 8. Discussion Replies Table
```sql
CREATE TABLE discussion_replies (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES discussion_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id)
);
```

### 9. Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  actor_id VARCHAR(36) NOT NULL,
  action_type ENUM('create', 'update', 'delete', 'enroll', 'complete') NOT NULL,
  entity_type ENUM('course', 'module', 'lesson', 'user', 'discussion') NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  entity_name VARCHAR(255),
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_actor_id (actor_id),
  INDEX idx_action_type (action_type),
  INDEX idx_entity_type (entity_type)
);
```

### 10. Chatbot Conversations Table
```sql
CREATE TABLE chatbot_conversations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  session_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id)
);
```

### 11. Chatbot Messages Table
```sql
CREATE TABLE chatbot_messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id)
);
```

### 12. File Uploads Table
```sql
CREATE TABLE file_uploads (
  id VARCHAR(36) PRIMARY KEY,
  lesson_id VARCHAR(36),
  uploaded_by_id VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_lesson_id (lesson_id),
  INDEX idx_uploaded_by_id (uploaded_by_id)
);
```

---

## AUTHENTICATION ENDPOINTS

### 1. User Registration
**POST** `/api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "enrolledCourses": ["course-1", "course-2"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Logout
**POST** `/api/auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Refresh Token
**POST** `/api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Forgot Password
**POST** `/api/auth/forgot-password`

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### 6. Reset Password
**POST** `/api/auth/reset-password`

**Request:**
```json
{
  "token": "reset-token-123",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## USER MANAGEMENT ENDPOINTS

### 1. Get Current User Profile
**GET** `/api/users/me`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "role": "student",
    "status": "active",
    "enrolledCourses": ["course-1", "course-2"],
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T15:45:00Z"
  }
}
```

### 2. Update User Profile
**PUT** `/api/users/me`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "updatedAt": "2024-01-20T16:00:00Z"
  }
}
```

### 3. Change Password
**POST** `/api/users/change-password`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password has been successfully changed."
}
```

### 4. Upload Avatar
**POST** `/api/users/avatar`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request:** `file: [binary image file]`

**Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://api.example.com/uploads/avatars/user-123.jpg"
  }
}
```

### 5. Get All Users (Admin)
**GET** `/api/users`

**Headers:** `Authorization: Bearer {token}`

**Query:** `?page=1&limit=20&role=student&sortBy=name&sortOrder=asc`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "status": "active",
      "enrolledCourses": ["course-1", "course-2"],
      "createdAt": "2024-01-15T10:30:00Z"
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

### 6. Update User (Admin)
**PUT** `/api/users/{userId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "status": "active",
    "updatedAt": "2024-01-20T16:00:00Z"
  }
}
```

### 7. Delete User (Admin)
**DELETE** `/api/users/{userId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```
