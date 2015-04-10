'use strict';

import { expect } from 'chai';
import request from 'supertest-as-promised';
import sequelizeFixtures from 'sequelize-fixtures';

import timeout from '../utils/timeout';
import models from '../models';

process.env.NODE_ENV = 'test';
process.env.PORT = 3006;

import app from '../server';

describe.only('transactions api', () => {
  before(async () => {
    await timeout(1000);
  });

  describe('authenticated requests', () => {
    let agent = request.agent(app);

    let transaction = {
      amount: 12.35,
      date: '2015-04-08T20:47:14.000Z',
      description: 'description',
      id: 1,
      location: 'location',
      method: 'bank'
    };

    //async function testLabelsLength(length) {
    //  let res = await agent
    //    .get('/api2/labels')
    //    .set('Accept', 'application/json');
    //
    //  expect(res.body.length).to.equal(length);
    //}
    //
    beforeEach(async () => {
      await models.sequelize.sync({force: true});
      await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
      await agent
        .post('/api2/auth')
        .send({username: 'timmu', password: 'parool22'});
    });

    it('should get all transactions', async () => {
      let res = await agent
        .get('/api2/transactions')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.eql([transaction]);
    });

    it('should get a specific transaction', async () => {
      let res = await agent
        .get('/api2/transactions/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.eql(transaction);
    });
    //
    //it('should add new label', async () => {
    //  let name = 'new label name';
    //
    //  let res = await agent
    //    .post('/api2/labels')
    //    .send({name: name})
    //    .set('Accept', 'application/json')
    //    .expect('Content-Type', /json/)
    //    .expect(201);
    //
    //  expect(res.body).to.eql({id: 2, name: name});
    //
    //  await testLabelsLength(2);
    //});
    //
    //it('should update a label', async () => {
    //  let name = 'new new label name';
    //  let expected = {id: 1, name: name};
    //
    //  let res = await agent
    //    .put('/api2/labels/1')
    //    .send({name: name})
    //    .set('Accept', 'application/json')
    //    .expect('Content-Type', /json/)
    //    .expect(200);
    //
    //  expect(res.body).to.eql(expected);
    //
    //  res = await agent
    //    .get('/api2/labels/1');
    //
    //  expect(res.body).to.eql(expected);
    //});
    //
    //it('should delete a label', async () => {
    //  await agent
    //    .delete('/api2/labels/1')
    //    .expect(204);
    //
    //  await testLabelsLength(0);
    //});
  });

  describe('unauthenticated requests', () => {
    beforeEach(async () => {
      await models.sequelize.sync({force: true});
      await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
    });

    it('should not return transactions', async () => {
      await request(app)
        .get('/api2/transactions')
        .set('Accept', 'application/json')
        .expect(401);
    });

    it('should not return transactions of other users', async () => {
      let agent = request.agent(app);

      await agent.post('/api2/auth').send({username: 'marten', password: 'parool22'});
      await agent
        .get('/api2/transactions/1')
        .set('Accept', 'application/json')
        .expect(404);
    });
  })
});