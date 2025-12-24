# Sikai Verse Frontend

A modern, production-ready Learning Management System (LMS) frontend built with React 19, TypeScript, and Vite.

## Overview

Sikai Verse is a comprehensive learning platform featuring:

- **Landing Page** with hero section, features grid, statistics, and testimonials
- **User Authentication** with login and profile management
- **Student Dashboard** with progress tracking and enrolled courses
- **Course Catalog** with search and filtering capabilities
- **Detailed Course Pages** with modules and lessons
- **Admin Dashboard** for course, module, and lesson management
- **Intelligent Chatbot** for learning assistance
- **Responsive Design** with Tailwind CSS
- **Form Validation** with React Hook Form and Zod
- **Toast Notifications** with Sonner

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 with dark mode support
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Routing**: React Router v6
- **Package Manager**: npm

## Installation

```bash
# Install dependencies
npm install
```

## Running the Project

```bash
# Development server (runs on 0.0.0.0:5173)
npm run dev

# Build for production
npm build

# Preview production build
npm start

# Lint code
npm run lint
```

## Project Structure

```
sikai-verse-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ProtectedRoute.tsx
│   │   └── Chatbot.tsx
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Login/
│   │   ├── Profile/
│   │   ├── StudentDashboard/
│   │   ├── Courses/
│   │   └── Admin/
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts              # Mock API calls
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── globals.css
├── public/
├── tailwind.config.ts
├── postcss.config.cjs
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Key Features

### Authentication
- Mock authentication system with role-based access control
- Student and Admin roles
- Protected routes with automatic redirects

### Pages
- **Landing**: Hero section with CTA, features, stats, testimonials
- **Login**: Email/password authentication with demo credentials
- **Dashboard**: Student progress tracking and enrolled courses
- **Courses**: Browse and search all available courses
- **Course Detail**: View course modules, lessons, and enroll
- **Admin**: Manage courses, modules, and lessons with forms

### Components
- Responsive navigation
- Course cards with ratings and student counts
- Progress indicators
- Form validation with error messages
- Toast notifications for user feedback
- Floating chatbot widget

### Chatbot
- Keyword-based responses
- Course recommendations
- Available on all pages
- Mock API integration

## Demo Credentials

```
Student:
Email: user@example.com
Password: any password

Admin:
Email: admin@example.com
Password: any password
```

## Development Notes

- All API calls are mocked in `lib/api.ts`
- Seed data is included in the API module
- Forms use React Hook Form with Zod validation
- Tailwind CSS variables for theming
- Dark mode support via CSS variables

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## License

MIT
