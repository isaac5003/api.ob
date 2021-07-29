import * as request from 'supertest';
import { newServicePayload, editServicePayload } from './services.payload';
import { v1 } from 'uuid';

const app = 'http://localhost:8001';

describe('SERVICES MODULE', () => {
  const path = '/services';
  const ids = [];
  let id = null;
  let token = null;

  beforeEach(async () => {
    const { body } = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'demo@prueba.com', password: '123456789' });
    token = `Bearer ${body.access_token}`;
  });

  it('POST / rejects when no token is sent', () => {
    return request(app)
      .get(path)
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
      });
  });

  it('POST / creates a new service', () => {
    return request(app)
      .post(path)
      .set('Content-Type', 'application/json')
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

  describe('POST / rejects when wrong value is sent', () => {
    it('wrong cost value type', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...newServicePayload, cost: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('wrong incIva value type', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...newServicePayload, incIva: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('wrong incRenta value type', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...newServicePayload, incIva: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });
  });

  describe('POST / rejects when any required value is not being sent', () => {
    const { name, cost, sellingType, description, incIva, incRenta5, incRenta10 } = newServicePayload;
    it('omitting name', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting cost', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ name, sellingType, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting sellingType', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, name, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting description', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, name, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting incIva', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, name, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting incRenta', () => {
      return request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, incIva, name })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });
  });

  it('GET /:id rejects when no token is sent', () => {
    return request(app)
      .get(`${path}/${id}`)
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
      });
  });

  it('GET /:id of created service includes expected data', () => {
    return request(app)
      .get(`${path}/${id}`)
      .set('Authorization', token)
      .expect(({ body }) => {
        expect(body.data.name).toBe(newServicePayload.name);
        expect(body.data.cost).toBe(newServicePayload.cost);
        expect(body.data.description).toBe(newServicePayload.description);
        expect(body.data.incIva).toBe(newServicePayload.incIva);
        expect(body.data.incRenta5).toBe(newServicePayload.incRenta5);
        expect(body.data.incRenta10).toBe(newServicePayload.incRenta10);
        expect(body.data.active).toBeTruthy();
        expect(body.data.sellingType.id).toBe(newServicePayload.sellingType);
        expect(body.data.sellingType.name).toBeDefined();
      });
  });

  it('GET /:id rejects when no valid id format is sent', () => {
    return request(app)
      .get(`${path}/wrong-id`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('GET /:id rejects when no existing id is sent', () => {
    return request(app)
      .get(`${path}/${v1()}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('PUT /:id rejects when no token is sent', () => {
    return request(app)
      .put(`${path}/${id}`)
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
      });
  });

  it('PUT /:id provides a response', () => {
    return request(app)
      .put(`${path}/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(editServicePayload)
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('PUT /:id of created service includes expected data', () => {
    return request(app)
      .get(`${path}/${id}`)
      .set('Authorization', token)
      .expect(({ body }) => {
        expect(body.data.name).toBe(editServicePayload.name);
        expect(body.data.cost).toBe(editServicePayload.cost);
        expect(body.data.description).toBe(editServicePayload.description);
        expect(body.data.incIva).toBe(editServicePayload.incIva);
        expect(body.data.incRenta5).toBe(editServicePayload.incRenta5);
        expect(body.data.incRenta10).toBe(editServicePayload.incRenta10);
        expect(body.data.active).toBeTruthy();
        expect(body.data.sellingType.id).toBe(editServicePayload.sellingType);
        expect(body.data.sellingType.name).toBeDefined();
      });
  });

  describe('PUT /:id rejects when wrong value is sent', () => {
    it('wrong cost value type', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...editServicePayload, cost: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('wrong incIva value type', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...editServicePayload, incIva: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('wrong incRenta value type', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ ...editServicePayload, incIva: 'hola' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });
  });

  describe('PUT /:id rejects when any required value is not being sent', () => {
    const { name, cost, sellingType, description, incIva, incRenta5, incRenta10 } = editServicePayload;
    it('omitting name', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting cost', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ name, sellingType, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting sellingType', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, name, description, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting description', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, name, incIva, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting incIva', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, name, incRenta5, incRenta10 })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });

    it('omitting incRenta', () => {
      return request(app)
        .put(`${path}/${id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send({ cost, sellingType, description, incIva, name })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.error).toBe('Bad Request');
        });
    });
  });

  it('PUT /:id rejects when no valid id format is sent', () => {
    return request(app)
      .put(`${path}/wrong-id`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('PUT /:id rejects when no existing id is sent', () => {
    return request(app)
      .put(`${path}/${v1()}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('DELETE /:id rejects when no token is sent', () => {
    return request(app)
      .delete(`${path}/${id}`)
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('Unauthorized');
      });
  });

  it('DELETE /:id rejects when no valid id format is sent', () => {
    return request(app)
      .delete(`${path}/wrong-id`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('DELETE /:id rejects when no existing id is sent', () => {
    return request(app)
      .delete(`${path}/${v1()}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
      });
  });

  it('DELETE /:id provides a response', () => {
    return request(app)
      .delete(`${path}/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /:id successfully deletes the service', () => {
    return request(app)
      .get(`${path}/${id}`)
      .set('Authorization', token)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBe('Bad Request');
        expect(body.message).toBeDefined();
      });
  });
});
