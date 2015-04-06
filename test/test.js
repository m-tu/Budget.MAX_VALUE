'use strict';

import assert from 'assert';
import request from 'supertest-as-promised';
import sequelizeFixtures from 'sequelize-fixtures';

import timeout from '../utils/timeout';
import models from '../models';

process.env.NODE_ENV = 'test';
process.env.PORT = 3006;

import app from '../server';

describe('label api', () => {
  before(async () => {
    await timeout(1000);
  });

  describe('authenticated requests', () => {
    let agent = request.agent(app);

    async function testLabelsLength(length) {
      let res = await agent
        .get('/api2/labels')
        .set('Accept', 'application/json');

      assert.equal(res.body.length, length);
    }

    beforeEach(async () => {
      await models.sequelize.sync({force: true});
      await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
      await agent
        .post('/api2/auth')
        .send({username: 'timmu', password: 'parool22'});
    });

    it('should get all labels', async () => {
      await agent
        .get('/api2/labels')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => assert.deepEqual(res.body, [{id: 1, name: 'timmu'}]))
        .expect(200);
    });

    it('should get a specific label', async () => {
      await agent
        .get('/api2/labels/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => assert.deepEqual(res.body, {id: 1, name: 'timmu'}))
        .expect(200);
    });

    it('should add new label', async () => {
      let name = 'new label name';

      await agent
        .post('/api2/labels')
        .send({name: name})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => assert.deepEqual(res.body, {id: 2, name: name}))
        .expect(201);

      await testLabelsLength(2);
    });

    it('should update a label', async () => {
      let name = 'new new label name';
      let expected = {id: 1, name: name};

      await agent
        .put('/api2/labels/1')
        .send({name: name})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => assert.deepEqual(res.body, expected))
        .expect(200);

      let res = await agent
        .get('/api2/labels/1');

      assert.deepEqual(res.body, expected);
    });

    it('should delete a label', async () => {
      await agent
        .delete('/api2/labels/1')
        .expect(204);

      await testLabelsLength(0);
    });
  });

  describe('unauthenticated requests', () => {
    beforeEach(async () => {
      await models.sequelize.sync({force: true});
      await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
    });

    it('should not return labels', async () => {
      await request(app)
        .get('/api2/labels')
        .set('Accept', 'application/json')
        .expect(401);
    });

    it('should not return labels of other users', async () => {
      let agent = request.agent(app);

      await agent.post('/api2/auth').send({username: 'marten', password: 'parool22'});
      await agent
        .get('/api2/labels/1')
        .set('Accept', 'application/json')
        .expect(404);
    });
  })
});