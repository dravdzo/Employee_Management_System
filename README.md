 
# Employee Management System

A hands-on Employee Management System built with **JavaScript, Node.js, Express.js, and MongoDB** to practice real-world backend development through structured implementation, practical tasks, and code reviews.

## Overview

Employee Management System is a backend-focused project designed to simulate a real-world employee management application.

The project focuses on building RESTful APIs, handling HTTP requests, managing employee data, validating user input, and interacting with MongoDB through Mongoose.

It is developed incrementally to strengthen backend development skills and apply professional coding practices.

## Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript | Programming Language |
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | NoSQL Database |
| Mongoose | MongoDB ODM |
| HTML | Frontend Structure |
| CSS | Frontend Styling |
| JavaScript | Frontend Interactions |
| CORS | Cross-Origin Resource Sharing |

## Project Structure

```text
Employee_Management_System/
│
├── node_modules/
│
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── employeeController.js
│   │
│   ├── model/
│   │   └── Employee.js
│   │
│   └── app.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Features

### Employee Management

- Create new employee records.
- Retrieve all employees.
- Retrieve a specific employee.
- Update employee information.
- Delete employee records.
- Retrieve active employees.
- Search employees.

### Data Validation

Employee data follows defined validation rules:

| Field | Validation |
|---|---|
| Name | Required and non-empty |
| Email | Valid email format |
| Age | Between 18 and 65 |
| Department | IT, HR, or Finance |
| Salary | Greater than or equal to 0 |

### Backend Architecture

The application follows a modular structure:

- **Config:** Database connection and configuration.
- **Models:** Database schemas and data structure.
- **Controllers:** Business logic and request handling.
- **App:** Express application setup and middleware configuration.

## API Endpoints

Base URL:

```text
http://localhost:2005
```

### Employee Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all employees |
| GET | `/employees/active` | Retrieve active employees |
| GET | `/employees/search` | Search employees |
| GET | `/employees/:id` | Retrieve employee by ID |
| POST | `/employees` | Create a new employee |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete employee |

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dravdzo/Employee_Management_System.git
```

### 2. Navigate to the Project

```bash
cd Employee_Management_System
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure MongoDB

Make sure MongoDB is running and configure your database connection in:

```text
src/config/db.js
```

### 5. Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The application runs on:

```text
http://localhost:2005
```

## Environment Variables

For database configuration, use environment variables rather than hardcoding sensitive connection details.

Example `.env`:

```env
PORT=2005
MONGO_URI=your_mongodb_connection_string
```

Make sure `.env` is included in `.gitignore`.

## Learning Objectives

This project is designed to practice:

- Understanding Node.js fundamentals.
- Building RESTful APIs using Express.js.
- Working with MongoDB and Mongoose.
- Implementing CRUD operations.
- Structuring backend applications.
- Handling HTTP requests and responses.
- Validating incoming data.
- Separating business logic from application setup.
- Managing database connections.
- Understanding real-world backend development workflows.

## Future Improvements

- Authentication and Authorization.
- Role-Based Access Control (RBAC).
- Password Hashing.
- API Error Handling and Centralized Middleware.
- Unit and Integration Testing.
- API Documentation using Swagger.
- Pagination and Advanced Filtering.
- Logging and Monitoring.
- Docker Containerization.
- Deployment and CI/CD.

## Project Status

<em>Under Development</em>

This project is continuously evolving as new backend concepts and development practices are implemented.


**Built with JavaScript, Node.js, Express.js, and MongoDB.**

