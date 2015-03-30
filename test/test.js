'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = 3006;

import assert from 'assert';
import request from 'supertest';
import app from '../server';
import sequelizeFixtures from 'sequelize-fixtures';
import models from '../models';
//import { db } from 'sequelize-tools';


describe('Array', () =>{
  let agent = request.agent(app);

  before(done => {
    // wait for db to load sample data so we can clear it later
    setTimeout(async () => {
      done();
    }, 1000);
  });

  beforeEach(async (done) => {
    await models.sequelize.sync({force: true});
    await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
    done();
  });

  it('should login with correct credentials', (done) => {
    agent
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool22'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should get all labels', done => {
    agent
      .get('/api2/labels')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => assert.deepEqual(res.body, [{id: 1, name: 'timmu'}]))
      .expect(200, done);
  });

  it('should add new label', done => {
    let name = 'new label name';

    agent
      .post('/api2/labels')
      .send({name: name})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => assert.deepEqual(res.body, {id: 2, name: name}))
      .expect(201, done);
  });

  it('should not login with incorrect credentials', (done) => {
    request(app)
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool2'})
      .set('Accept', 'application/json')
      .expect(401, done);
  });
});