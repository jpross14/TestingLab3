

import request from 'supertest';

const fs = require('fs');
const path = require('path');
const API_URL = 'http://localhost:5001';
const dbPath = path.join(__dirname, '../testDB.json');



describe('API tests', () => {
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

    // SAD PATHS ===============================================

    //  Sad Path - POST - this should fail
    it('should create a new task', async () => {
      const newTask = { task: "This should be a failed. It shouldn't appear in any DB"};
  
      const response = await request(API_URL)
        .post('/')
        .send(newTask);

      expect(response.status).toBe(201);
    });





    // // Clears testDB after the test runs
    // afterAll(() => {
    //     const emptyDb = { todos: [] };
    //     fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2));
    //     console.log('Test DB cleared');
    // });
});
