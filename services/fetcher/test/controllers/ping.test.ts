import request from 'supertest';

import { app } from '../../src/app';

describe('Test Ping Controller', () => {
    describe('Route GET /', () => {
        test('should return pong', async () => {
            const res = await request(app).get('/');
            expect(res.body).toEqual({ message: 'Pong' });
        });
    });
});
