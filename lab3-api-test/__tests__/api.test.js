

import request from 'supertest';

const fs = require('fs');
const path = require('path');
const API_URL = 'http://localhost:5001/todos';
const dbPath = path.join(__dirname, '../testDB.json');



describe('API tests', () => {
    let createdTaskId;

    beforeAll(async () => {
      const newTask = { task: "Test task for update/delete" };
      const response = await request(API_URL)
        .post('/')
        .send(newTask);
      createdTaskId = response.body.id;
    });

    // Happy path - POST -  expected to pass and passes
    it('should create a new task', async () => {
        const newTask = { task: "This is a testDB POST-test task" };
    
        const response = await request(API_URL)
          .post('/')
          .send(newTask);
    
        expect(response.status).toBe(201);

        expect(response.body.task).toBe(newTask.task);
    });


    // Happy path - GET - expected to pass and passes
    it('should return all tasks', async () => {
        try {
          const response = await request(API_URL).get();


          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);

        } catch (error) {
          console.error(error.message);
        }
    });

    // Happy Path - UPDATE - this should pass
    it('should update an existing task', async () => {
      const updatedTask = { task: "Updated task text" };

      const response = await request(API_URL)
        .put(`/${createdTaskId}`)
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body.task).toBe(updatedTask.task); // Verify the updated task
    });

    // Happy Path - DELETE - this should pass
    it('should delete an existing task', async () => {
      const response = await request(API_URL)
        .delete(`/${createdTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted');
    });


    // SAD PATHS ===============================================


    //  Sad Path - POST - this should fail as its the wrong endpoint
    it('should create a new task', async () => {
      const newTask = { task: "This should be a failed. It shouldn't appear in any DB"};

      const response = await request(API_URL)
        .post('/todds')
        .send(newTask);

      expect(response.status).toBe(201);
    });

    //  Sad Path - POST - expected to fail but passes
    it('should fail as task is a type of string', async () => {
      const newTask = { task: 1234534};
  
      const response = await request(API_URL)
        .post('/')
        .send(newTask);

      expect(response.status).toBe(201);
    });

    // Sad Path - GET - expected to pass but fails
    it('should return 500 if there is a server error', async () => {
     
        const response = await request(API_URL).get('/todos');
        
        expect(response.status).toBe(500);
    });

    // Sad Path - GET - expected to pass but fails
    it('should return 200 when fetching tasks', async () => {
        const response = await request(API_URL).get('/todos/1');
    
        expect(response.status).toBe(200);
        expect(response.body).not.toHaveProperty('status');
    });

    // Sad Path - UPDATE non-existent task - this should fail
    it('should return 404 when updating a non-existent task', async () => {
      const fakeId = '999999'; // Non-existent ID
      const updatedTask = { task: "This should fail" };

      const response = await request(API_URL)
        .put(`/${fakeId}`)
        .send(updatedTask);

      expect(response.status).toBe(404);
    });

    // Sad Path - UPDATE with invalid ID format - this should fail
  it('should return 404 for invalid ID format', async () => {
    const invalidId = "not-a-number";
    const updatedTask = { task: "Valid task, invalid ID" };

    const response = await request(API_URL)
      .put(`/${invalidId}`)
      .send(updatedTask);

    expect(response.status).toBe(404);
  });

    // Sad Path - DELETE non-existent task - it should fail
    it('should return 404 when deleting a non-existent task', async () => {
      const fakeId = '999999'; // Non-existent ID

      const response = await request(API_URL)
        .delete(`/${fakeId}`);

      expect(response.status).toBe(404);
    });

    


    // Clears testDB after the test runs
    afterAll(() => {
        try {
          console.log('Cleaning up the test database...');
          fs.writeFileSync(dbPath, JSON.stringify({ todos: [] }, null, 2)); 
          console.log('Test database cleaned up!');
        } catch (error) {
          console.error(error);
        }
    });
});
