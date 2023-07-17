const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const app = require('../index');
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

describe('User Management System API', () => {
  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        password: 'newpassword',
      };

      const response = await request(app)
        .post('/users/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ username: userData.username });
      expect(user).toBeTruthy();
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return 400 if username is missing', async () => {
      const userData = {
        password: 'newpassword',
      };

      await request(app)
        .post('/users/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /users/login', () => {
    it('should login and get a valid JWT token', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpassword',
      };

      const response = await request(app)
        .post('/users/login')
        .send(userData)
        .expect(200);

      expect(response.body.token).toBeTruthy();
    });

    it('should return 401 for invalid credentials', async () => {
      const userData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      await request(app)
        .post('/users/login')
        .send(userData)
        .expect(401);
    });
  });
});
