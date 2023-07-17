const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-core'); 
const app = require('../index');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const auth = require('../auth');

// Set up an in-memory MongoDB instance for testing
const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Task Management System API', () => {
  let token;
  let taskId;

  beforeAll(async () => {
    // Register a user for testing
    const userData = { username: 'testuser', password: 'testpassword' };
    const hashedPassword = await auth.hashPassword(userData.password);
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();

    // Login to get the JWT token
    const loginResponse = await request(app)
      .post('/users/login')
      .send({ username: userData.username, password: userData.password });
    token = loginResponse.body.token;
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Task 1',
        description: 'This is Task 1',
        status: 'in progress',
        dueDate: '2023-07-31',
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      taskId = response.body._id;
      expect(response.body).toMatchObject(taskData);
    });

    it('should return 401 if no token is provided', async () => {
      const taskData = {
        title: 'Task 2',
        description: 'This is Task 2',
        status: 'pending',
        dueDate: '2023-08-15',
      };

      await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(401);
    });
  });

  describe('GET /tasks', () => {
    it('should retrieve all tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should retrieve a specific task by ID', async () => {
      await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 if task ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTaskData = {
        title: 'Updated Task 1',
        status: 'completed',
      };

      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTaskData)
        .expect(200);

      expect(response.body).toMatchObject(updatedTaskData);
    });

    it('should return 404 if task ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .patch(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const task = await Task.findById(taskId);
      expect(task).toBeNull();
    });

    it('should return 404 if task ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
