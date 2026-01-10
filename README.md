# 🎓 F-Code Learning Platform

> A modern online learning platform built with React and Node.js

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)

---

## Features

| Feature                | Description                                |
| ---------------------- | ------------------------------------------ |
| **Authentication**     | Register, Login with JWT token             |
| **User Roles**         | Student, Teacher, Admin                    |
| **Course Management**  | Create, edit, delete courses               |
| **Chapters & Lessons** | Organize content with chapters and lessons |
| **Video Lessons**      | Support video, document, and quiz content  |
| **Progress Tracking**  | Track lesson completion and watch time     |
| **Reviews & Ratings**  | Rate and review courses                    |
| **Messaging**          | Direct messaging between users             |

---

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

### Frontend

- **Library:** React 18
- **Routing:** React Router DOM
- **UI Framework:** Bootstrap 5
- **HTTP Client:** Axios

---

## Project Structure

```
fcode/
├── backend/
│   ├── server.js              # Entry point
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── connectDB.js   # Database connection
│       ├── controllers/
│       │   └── authController.js
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
│       │   └── index.js       # Model relationships
│       └── routes/
│           └── auth.js
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── pages/
│       │   ├── LoginPage.js
│       │   └── RegisterPage.js
│       └── services/
│           └── authService.js
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js (v18+)
- MySQL Server
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd fcode
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fcode_db
DB_DIALECT=mysql
PORT=8080
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`

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
                 │                          └─────────────┘  │
                 │                                 │         │
                 │    ┌─────────────┐              │         │
                 │    │  Chapters   │◄─────────────┘         │
                 │    ├─────────────┤                        │
                 │    │ chapter_id  │                        │
                 │    │ course_id   │                        │
                 │    │ title       │                        │
                 │    │ order_index │                        │
                 │    └─────────────┘                        │
                 │           │                               │
                 │           ▼                               │
                 │    ┌─────────────┐                        │
                 │    │   Lessons   │                        │
                 │    ├─────────────┤                        │
                 │    │ lesson_id   │                        │
                 │    │ chapter_id  │                        │
                 │    │ title       │                        │
                 │    │ content_type│                        │
                 │    │ video_url   │                        │
                 │    └─────────────┘                        │
                 │           │                               │
                 ▼           ▼                               │
         ┌───────────────────────────┐                       │
         │     LessonProgress        │                       │
         ├───────────────────────────┤                       │
         │ user_id ──────────────────┼───────────────────────┘
         │ lesson_id                 │
         │ is_completed              │
         │ last_watched_second       │
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
| `Messages`       | Direct messages between users              |

### SQL Schema

<details>
<summary> Click to expand full SQL schema</summary>

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

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| `POST` | `/api/auth/register` | Register new user       |
| `POST` | `/api/auth/login`    | Login and get JWT token |

#### Register Request

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "student"
}
```

#### Login Request

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### Login Response

```json
{
  "message": "Login successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": null
  }
}
```

---

## License

This project is licensed under the ISC License.

---

<p align="center">
  Made by FCT1(Team 7)
</p>
