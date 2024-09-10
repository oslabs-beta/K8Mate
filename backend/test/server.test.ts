import request from 'supertest';
import app from '../server.ts'
import { NextFunction, Request, Response } from 'express';

describe('Testing HTTP Endpoints', () => {
  it('Should return 404 for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('This is not the page you are looking for...');
  });
});

describe('Error handling middleware', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('This is not the page you are looking for...');
    });
  });

  describe('Test /alert/create route', () => {
    it('should return 200 for valid POST request', async () => {
      const res = await request(app).get('/alert/create').send({
        message: 'Test alert message',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
    });
  });
  
  describe('Test /alert/all route', () => {
    it('should return 200 for valid GET request', async () => {
      const res = await request(app).get('/alert/all').send({
        message: 'Test alert message',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
    });
  });

  describe('Test /alert/update route', () => {
    it('should return 200 for valid PUT request', async () => {
      const res = await request(app).put('/alert/update').send({
        message: 'Test alert message',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
    });
  });

  describe('Test /alert/delete route', () => {
    it('should return 200 for valid DELETE request', async () => {
      const res = await request(app).delete('/alert/delete').send({
        message: 'Test alert message',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.any(Object));
    });
  });

  describe('Test /cluster/history route', () => {
    it('Should return 200 for valid GET request', async () => {
        const res = await request(app).get('/cluster/history').send({
            message:'Test alert message',
        });
        console.log(res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
    })
  })

  describe('Test /cluster/postAll route', () => {
    it('Should return 200 for valid POST request', async () => {
        const res = await request(app).post('/cluster/postAll').send({
            message:'Test alert message',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
    })
  })

  describe('Test /cluster/all route', () => {
    it('Should return 200 for valid GET request', async () => {
        const res = await request(app).get('/cluster/all').send({
            message:'Test alert message',
        })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
    })
  })

  describe('Test /cluster/refresh route', () => {
    it('Should return 200 for valid GET request', async () => {
        const res = await request(app).get('/cluster/refresh').send({
            message:'Test alert message',
        })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
    })
  })

  describe('Test /cluster/postPods route', () => {
    it('Should return 200 for valid POST request', async () => {
        const res = await request(app).post('/cluster/postPods').send({
            message:'Test alert message',
        })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object))
    })
  })
