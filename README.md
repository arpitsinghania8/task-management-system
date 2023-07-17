# Task Management System API

The Task Management System API is a RESTful API built using Node.js with Express. It allows users to create, read, update, and delete tasks. The API uses token-based authentication and authorization for secure access to endpoints.

## Prerequisites

Before setting up the API, make sure you have the following installed on your system:

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/try/download/community)

## Setup Instructions

1. Clone the repository or download the source code:

```bash
git clone https://github.com/your-username/task-management-api.git
```

2. Change directory to the project folder:
```bash
cd task-management-api
```

3. Install the dependencies:
```bash
npm install
```

## Running the API

1. Start your MongoDB server. If you're using the default configuration, simply run:
```bash
mongod
```
2. Start the API server:
```bash
npm start
```
3. The API will start running at http://localhost:3000.

## API Documentation (Swagger)
You can access the API documentation using Swagger UI. Open your web browser and visit:

```bash
http://localhost:3000/api-docs
```

## Running Unit Tests
To run the unit tests, use the following command:

```bash
npm test
```

## API Endpoints
The API provides the following endpoints:

1. POST /users/register: User registration (Create a new user).
2. POST /users/login: User login (Get JWT token).

1. POST /tasks: Create a new task (Authentication required).
2. GET /tasks: Retrieve all tasks (Authentication required).
3. GET /tasks/:id: Retrieve a specific task by ID (Authentication required).
4. PATCH /tasks/:id: Update a task (Authentication required).
5. DELETE /tasks/:id: Delete a task (Authentication required).