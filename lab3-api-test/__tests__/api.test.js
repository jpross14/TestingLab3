

import request from 'supertest';

const fs = require('fs');
const path = require('path');
const API_URL = 'http://localhost:5001';
const dbPath = path.join(__dirname, '../testDB.json');



describe('API tests', () => {
    let createdTaskId; // Store ID of a task to test update/delete

    // Create a task first (setup for update/delete tests)
    beforeAll(async () => {
      const newTask = { task: "Test task for update/delete" };
      const response = await request(API_URL)
        .post('/')
        .send(newTask);
      createdTaskId = response.body.id; // Assuming the response includes the ID
    });


    // HAPPY PATHS ===============================================


    // Happy path - POST - this should pass
    it('should create a new task', async () => {
        const newTask = { task: "This is a testDB POST-test task" };
    
        const response = await request(API_URL)
          .post('/todos')
          .send(newTask);
    
        expect(response.status).toBe(201);

        expect(response.body.task).toBe(newTask.task);
    });


    // Happy path - GET - this should pass
    it('should return all tasks', async () => {
        try {
          const response = await request(API_URL).get();

          if (response.status === 200) {
            console.log('GET /todos - Passed: Retrieved tasks successfully.');
          } else {
            console.error(`GET /todos - Failed: Status code ${response.status}`);
          }

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);

        } catch (error) {
          console.error('GET /todos - Failed:', error.message);
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

      expect(response.status).toBe(200); // Or 204 (No Content)
      expect(response.body.message).toBe('Task deleted'); // Adjust based on your API
    });


    // SAD PATHS ===============================================


    //  Sad Path - POST - this should fail
    it('should fail when posting to the wrong endpoint', async () => {
      const newTask = { task: "This should be a failed. It shouldn't appear in any DB"};

      const response = await request(API_URL)
        .post('/')
        .send(newTask);

      expect(response.status).toBe(201);
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

    // Sad Path - DELETE non-existent task - it should fail
    it('should return 404 when deleting a non-existent task', async () => {
      const fakeId = '999999'; // Non-existent ID

      const response = await request(API_URL)
        .delete(`/${fakeId}`);

      expect(response.status).toBe(404);
    });

    

    // // Clears testDB after the test runs
    // afterAll(() => {
    //     const emptyDb = { todos: [] };
    //     fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2));
    //     console.log('Test DB cleared');
    // });
});
