import * as request from 'supertest';
import { newServicePayload } from './services.payload';

const app = 'http://localhost:5001';

describe('SERVICES MODULE', () => {
  const ids = [];
  let id = null;
  let token;

  beforeEach(async () => {
    const { body } = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ email: 'demo@prueba.com', password: '123456789' });
    token = `Bearer ${body.access_token}`;
  });

  describe('POST /', () => {
    const path = '/services';

    it('rejects when no token is sent', () => {
      return request(app)
        .get(path)
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toBe('Unauthorized');
        });
    });

    it('creates a new service', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token)
        .send(newServicePayload)
        .expect(201)
        .expect(({ body }) => {
          id = body.id;
          ids.push(id);
          expect(body.id).toBeDefined();
          expect(body.message).toBeDefined();
        });
    });

    it('service created has expected data', () => {
      return request(app)
        .get(`${path}/${id}`)
        .set('Authorization', token)
        .expect(({ body }) => {
          expect(body.data.name).toBe(newServicePayload.name);
          expect(body.data.cost).toBe(newServicePayload.cost);
          expect(body.data.sellingType.id).toBe(newServicePayload.sellingType);
          expect(body.data.description).toBe(newServicePayload.description);
          expect(body.data.incIva).toBe(newServicePayload.incIva);
          expect(body.data.incRenta).toBe(newServicePayload.incRenta);
          expect(body.data.active).toBeTruthy();
        });
    });

    describe('rejects when any required value is not being sent', () => {
      const { name, cost, sellingType, description, incIva, incRenta } = newServicePayload;
      it('omiting name', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ cost, sellingType, description, incIva, incRenta })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
      it('omiting cost', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ name, sellingType, description, incIva, incRenta })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
      it('omiting sellingType', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ cost, name, description, incIva, incRenta })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
      it('omiting description', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ cost, sellingType, name, incIva, incRenta })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
      it('omiting incIva', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ cost, sellingType, description, name, incRenta })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
      it('omiting incRenta', () => {
        return request(app)
          .post(path)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', token)
          .send({ cost, sellingType, description, incIva, name })
          .expect(400)
          .expect(({ body }) => {
            expect(body.message).toBeDefined();
            expect(body.error).toBe('Bad Request');
          });
      });
    });
  });

  describe('GET /:id', () => {
    const path = `/services/${id}`;

    it('rejects when no token is sent', () => {
      return request(app)
        .get(path)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(401)
        .expect(({ body }) => {
          expect(body.message).toBe('Unauthorized');
        });
    });

    // it('returns the required information', () => {

    //   return request(app)
    //     .get(path)
    //     .set('Content-Type', 'application/x-www-form-urlencoded')
    //     .set('Authorization', token)
    //     .expect(400)
    //     .expect(({ body }) => {
    //     });
    // });
  });
});
