# F-Code Learning Platform

> A modern online learning platform built with React and Node.js

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)

---

## Features

### Core Features

| Feature                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| **Authentication**     | Secure register & login with JWT token          |
| **User Roles**         | Student, Teacher, Admin with role-based access   |
| **Course Management**  | Full CRUD operations for courses                 |
| **Chapters & Lessons** | Hierarchical content organization                |
| **Video Lessons**      | Support for video, document, and quiz content    |
| **Progress Tracking**  | Real-time lesson completion and watch time       |
| **Reviews & Ratings**  | Course rating system with comments               |
| **Real-time Chat**     | Live messaging between users with Socket.io      |

### Advanced Features

| Feature                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| **User Profiles**        | Customizable profiles with avatar & bio        |
| **Course Enrollment**    | Enroll in courses and track your learning      |
| **Teacher Dashboard**    | Manage courses, chapters, and lessons          |
| **Responsive Design**    | Mobile-first design with Material-UI           |
| **Access Control**       | Role-based authorization for protected routes  |
| **Default Thumbnails**   | Automatic fallback for course thumbnails       |
| **Interactive UI**       | Modern, animated components with smooth UX     |

---

## Tech Stack

### Backend

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **ORM:** Sequelize 6
- **Database:** MySQL 2
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Real-time:** Socket.io 4
- **Environment:** dotenv
- **CORS:** cors middleware
- **Dev Tools:** nodemon

### Frontend

- **Library:** React 19
- **Routing:** React Router DOM 7
- **UI Framework:** Material-UI (MUI) 7
- **Icons:** Material Icons, Lucide React
- **Styling:** Bootstrap 5 + Custom CSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client 4
- **State Management:** React Hooks
- **Testing:** React Testing Library

---

## Project Structure

```
fcode/
├── backend/
│   ├── server.js                 # Entry point with Socket.io
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── src/
│       ├── config/
│       │   └── connectDB.js      # Sequelize database connection
│       ├── controllers/
│       │   ├── authController.js     # Login, Register logic
│       │   ├── courseController.js   # CRUD courses, enroll, chapters, lessons
│       │   ├── chatController.js     # Get chat history
│       │   └── reviewController.js   # Course reviews & ratings
│       ├── middlewares/
│       │   └── authMiddleware.js     # JWT token verification
│       ├── models/
│       │   ├── User.js
│       │   ├── Course.js
│       │   ├── Category.js
│       │   ├── Chapter.js
│       │   ├── Lesson.js
│       │   ├── Enrollment.js
│       │   ├── LessonProgress.js
│       │   ├── Review.js
│       │   ├── Message.js
│       │   └── index.js              # Model associations
│       └── routes/
│           ├── auth.js               # /api/auth/*
│           ├── course.js             # /api/courses/*
│           ├── chat.js               # /api/chat/*
│           └── review.js             # /api/reviews/* 
├── frontend/
    ├── package.json
    ├── public/
    │   ├── index.html
    │   └── thumbnail.png         # Default course thumbnail
    └── src/
        ├── App.js                # Main app with routing
        ├── index.js
        ├── index.css
        ├── theme.js              # Material-UI theme configuration
        ├── components/
        │   ├── Header.js         # Navigation bar with auth
        │   ├── Footer.js         # Footer with links
        │   ├── CourseCard.js     # Course display card
        │   └── ChatBox.js        # Real-time chat component
        ├── pages/
        │   ├── HomePage.js           # Landing page with course list
        │   ├── LoginPage.js          # User login
        │   ├── RegisterPage.js       # User registration
        │   ├── CourseDetailPage.js   # Course info, reviews, enroll
        │   ├── CourseLessonsPage.js  # Course curriculum view
        │   ├── LessonPage.js         # Video player & lesson content
        │   ├── CreateCoursePage.js   # Teacher course creation
        │   ├── ProfilePage.js        # User profile & enrolled courses
        │   └── AccessDeniedPage.js   # 403 error page
        └── services/
            ├── authService.js    # Auth API calls
            ├── courseService.js  # Course API calls
            └── reviewService.js  # Review API calls

```

---

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL Server** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

### 1. Clone the repository

```bash
git clone https://github.com/dltuananh123/fcode.git
cd fcode
```

### 2. Database Setup

Create a new MySQL database:

```sql
CREATE DATABASE fcode_db;
```

Optionally, run the schema file:

```bash
mysql -u root -p fcode_db < fcode_db.sql
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fcode_db
DB_DIALECT=mysql
PORT=8080
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
npm start
```

> **Note:** On first run, the database tables will be created automatically using Sequelize sync. The server will run on `http://localhost:8080`

### 4. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### 5. Seed Sample Data (Optional)

To populate the database with sample data for testing:

```bash
mysql -u root -p fcode_db < seed_data_sample.sql
```

This will create:
- Sample users (students, teachers, admin)
- Sample courses with chapters and lessons
- Sample enrollments and reviews

### 6. Default Login Credentials (After Seeding)

After running the seed data, you can use these credentials:

- **Student:** `student@example.com` / `password123`
- **Teacher:** `teacher@example.com` / `password123`
- **Admin:** `admin@example.com` / `password123`


---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │  Categories │       │   Courses   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ user_id     │──┐    │ category_id │──┐    │ course_id   │
│ full_name   │  │    │ name        │  │    │ teacher_id  │──┐
│ email       │  │    │ description │  │    │ category_id │  │
│ password    │  │    └─────────────┘  │    │ title       │  │
│ avatar_url  │  │                     │    │ description │  │
│ role        │  │                     └────│ thumbnail   │  │
│ bio         │  │                          │ price       │  │
└─────────────┘  │                          │ level       │  │
      │          │                          └─────────────┘  │
      │          │                                 │         │
      │          │    ┌─────────────┐              │         │
      │          │    │  Chapters   │◄─────────────┘         │
      │          │    ├─────────────┤                        │
      │          │    │ chapter_id  │                        │
      │          │    │ course_id   │                        │
      │          │    │ title       │                        │
      │          │    │ order_index │                        │
      │          │    └─────────────┘                        │
      │          │           │                               │
      │          │           ▼                               │
      │          │    ┌─────────────┐                        │
      │          │    │   Lessons   │                        │
      │          │    ├─────────────┤                        │
      │          │    │ lesson_id   │                        │
      │          │    │ chapter_id  │                        │
      │          │    │ title       │                        │
      │          │    │ content_type│                        │
      │          │    │ video_url   │                        │
      │          │    └─────────────┘                        │
      │          │           │                               │
      │          ▼           ▼                               │
      │  ┌───────────────────────────┐                       │
      │  │     LessonProgress        │                       │
      │  ├───────────────────────────┤                       │
      │  │ user_id ──────────────────┼───────────────────────┘
      │  │ lesson_id                 │
      │  │ is_completed              │
      │  │ last_watched_second       │
      │  └───────────────────────────┘
      │
      │  ┌───────────────────────────┐
      └─►│        Messages           │
         ├───────────────────────────┤
         │ message_id                │
         │ sender_id (FK → Users)    │
         │ receiver_id (FK → Users)  │
         │ content                   │
         │ is_read                   │
         │ created_at                │
         └───────────────────────────┘
```

### Tables Overview

| Table            | Description                                |
| ---------------- | ------------------------------------------ |
| `Users`          | User accounts (students, teachers, admins) |
| `Categories`     | Course categories/subjects                 |
| `Courses`        | Course information                         |
| `Chapters`       | Course chapters for organization           |
| `Lessons`        | Individual lessons (video/document/quiz)   |
| `Enrollments`    | Student course enrollments                 |
| `LessonProgress` | Track user progress per lesson             |
| `Reviews`        | Course ratings and reviews                 |
| `Messages`       | Real-time chat messages                    |

### SQL Schema

<details>
<summary>Click to expand full SQL schema</summary>

```sql
-- 1. USERS TABLE
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. COURSES TABLE
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    price DECIMAL(10, 2) DEFAULT 0,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- 4. CHAPTERS TABLE
CREATE TABLE Chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 1,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- 5. LESSONS TABLE
CREATE TABLE Lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('video', 'document', 'quiz') DEFAULT 'video',
    video_url VARCHAR(255),
    content_text TEXT,
    duration_seconds INT DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 1,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

-- 6. ENROLLMENTS TABLE
CREATE TABLE Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed', 'refunded') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);

-- 7. LESSON PROGRESS TABLE
CREATE TABLE LessonProgress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_second INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

-- 8. REVIEWS TABLE
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- 9. MESSAGES TABLE
CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

</details>

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| `POST` | `/api/auth/register` | Register new user       | No            |
| `POST` | `/api/auth/login`    | Login and get JWT token | No            |

### Courses

| Method   | Endpoint                           | Description                  | Auth Required |
| -------- | ---------------------------------- | ---------------------------- | ------------- |
| `GET`    | `/api/courses`                     | Get all courses              | No            |
| `GET`    | `/api/courses/:id`                 | Get course by ID             | No            |
| `POST`   | `/api/courses`                     | Create new course            | Yes (Teacher) |
| `PUT`    | `/api/courses/:id`                 | Update course                | Yes (Teacher) |
| `DELETE` | `/api/courses/:id`                 | Delete course                | Yes (Teacher) |
| `POST`   | `/api/courses/enroll`              | Enroll in a course           | Yes           |
| `GET`    | `/api/courses/:id/chapters`        | Get course chapters          | No            |
| `POST`   | `/api/courses/:id/chapters`        | Create chapter               | Yes (Teacher) |
| `PUT`    | `/api/courses/chapters/:chapterId` | Update chapter               | Yes (Teacher) |
| `DELETE` | `/api/courses/chapters/:chapterId` | Delete chapter               | Yes (Teacher) |
| `POST`   | `/api/courses/chapters/:id/lessons`| Create lesson                | Yes (Teacher) |
| `PUT`    | `/api/courses/lessons/:lessonId`   | Update lesson                | Yes (Teacher) |
| `DELETE` | `/api/courses/lessons/:lessonId`   | Delete lesson                | Yes (Teacher) |
| `GET`    | `/api/courses/my-courses`          | Get user's enrolled courses  | Yes           |

### Reviews

| Method   | Endpoint                    | Description              | Auth Required |
| -------- | --------------------------- | ------------------------ | ------------- |
| `GET`    | `/api/reviews/course/:id`   | Get course reviews       | No            |
| `POST`   | `/api/reviews`              | Create/update review     | Yes           |
| `DELETE` | `/api/reviews/:id`          | Delete review            | Yes           |

### Chat

| Method | Endpoint    | Description      | Auth Required |
| ------ | ----------- | ---------------- | ------------- |
| `GET`  | `/api/chat` | Get chat history | Yes           |

### User Profile

| Method | Endpoint              | Description        | Auth Required |
| ------ | --------------------- | ------------------ | ------------- |
| `GET`  | `/api/auth/profile`   | Get user profile   | Yes           |
| `PUT`  | `/api/auth/profile`   | Update profile     | Yes           |

### Socket.io Events

| Event             | Direction       | Description          | Payload                          |
| ----------------- | --------------- | -------------------- | -------------------------------- |
| `send_message`    | Client → Server | Send a chat message  | `{ receiverId, content }`        |
| `receive_message` | Server → Client | Receive chat message | `{ senderId, content, timestamp }`|

---

## License

This project is licensed under the ISC License.

---

<p align="center">
  Made by FCT1(Team 7)
</p>
