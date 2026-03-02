# 🏢 WFH Attendance

Enterprise-style Work From Home (WFH) Attendance Management System built with **NestJS, React, MySQL, JWT, and TypeScript**.  
This system allows employees to check-in with photo proof and enables HR to monitor attendance, employee data, and attendance analytics through a professional dashboard.

---

# 📁 Project Structure

```
WFHAttendance/
│
├── wfh-attendance-backend/      # NestJS REST API
│
├── wfh-attendance-frontend/     # React + Vite Frontend
│
└── README.md
```

---

# ✨ Features

## 👤 Authentication
- Secure login using JWT
- Role-based access control (Employee & HRD)
- Protected API routes using JWT Guard

## 🕒 Attendance Management
- Employee daily check-in with photo upload
- Attendance stored with timestamp
- Attendance calendar view
- View personal attendance history
- Prevent duplicate check-in on same day

## 🧑‍💼 Employee Management (HRD)
- Create employee
- Update employee data
- Delete employee
- View employee list
- Role management (HRD / Employee)

## 📊 HR Dashboard
- Total employee count
- Today's attendance count
- Absent employee count
- Attendance rate (%)
- Attendance history table with photo preview
- Search and filter attendance records

## 🖥 UI Features
- Modern enterprise layout with sidebar
- Role-based navigation
- Calendar attendance view
- Modal image preview
- Responsive design

---

# 🛠 Tech Stack

## Backend
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Multer (File Upload)
- REST API

## Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- FullCalendar
- Axios

## Database
- MySQL

---

# ⚙️ Backend Setup

Go to backend folder:

```bash
cd wfh-attendance-backend
```

Install dependencies:

```bash
npm install
```

Configure database in:

```
src/app.module.ts
```

Example:

```ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'wfh_attendance',
  autoLoadEntities: true,
  synchronize: true,
})
```

Run backend:

```bash
npm run start:dev
```

Backend runs on:

```
http://localhost:3000
```

---

# ⚙️ Frontend Setup

Go to frontend folder:

```bash
cd wfh-attendance-frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

Login:

```
POST /auth/login
```

Response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

Token contains:

```json
{
  "sub": 1,
  "email": "employee@email.com",
  "name": "Employee Name",
  "role": "employee"
}
```

Used for protected routes via:

```
Authorization: Bearer TOKEN
```

---

# 📡 API Endpoints

## Auth

```
POST /auth/login
```

---

## Attendance

Employee:

```
POST /attendance/checkin
GET  /attendance/my
GET  /attendance/today
```

HRD:

```
GET /attendance/all
GET /attendance/count/today
GET /attendance/stats
```

---

## Employee

```
GET    /employee
GET    /employee/:id
POST   /employee
PUT    /employee/:id
DELETE /employee/:id
GET    /employee/count
```

---

# 🗄 Database Schema

## employee

```
id
name
email
password
role
department
created_at
```

## attendance

```
id
employee_id
checkin_time
photo
```

---

# 📸 File Upload

Uploaded images stored in:

```
wfh-attendance-backend/uploads/
```

Accessible via:

```
http://localhost:3000/uploads/filename.jpg
```

---

# 🧠 Role-Based Access

Employee:
- Check-in attendance
- View personal attendance

HRD:
- View dashboard
- View all attendance
- Manage employees
- View attendance analytics

---

# 🚀 How to Run Full Project

Start backend:

```bash
cd wfh-attendance-backend
npm install
npm run start:dev
```

Start frontend:

```bash
cd wfh-attendance-frontend
npm install
npm run dev
```

---

# 🧪 Default Test Account (Example)

HRD:

```
email: hrd@gmail.com
password: 123456
```

Employee:

```
email: employee@gmail.com
password: 123456
```

---

# 🧩 Architecture

Frontend:

```
React → Axios → NestJS API
```

Backend:

```
NestJS → TypeORM → MySQL
```

Auth:

```
JWT → Guard → Role Guard
```