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

  function testLabelsLength(length, done) {
    return function() {
      agent
        .get('/api2/labels')
        .set('Accept', 'application/json')
        //.expect('Content-Type', /json/)
        .end((err, res) => {
          console.log(err, res && res.headers, res.status);
          assert.equal(res.body.length, length);
          done();
        });
    };
  }

  before(done => {
    // wait for db to load sample data so we can clear it later
    setTimeout(async () => {
      done();
    }, 1000);
  });

  beforeEach(async (done) => {
    await models.sequelize.sync({force: true});
    await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
    agent
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool22'})
      .end(done)
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

  it('should get a specific label', done => {
    agent
      .get('/api2/labels/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => assert.deepEqual(res.body, {id: 1, name: 'timmu'}))
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
      .expect(201, testLabelsLength(2, done));
  });

  it('should update a label', done => {
    let name = 'new new label name';
    let expected = {id: 1, name: name};

    agent
      .put('/api2/labels/1')
      .send({name: name})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => assert.deepEqual(res.body, expected))
      .expect(200, () => {
        agent
          .get('/api2/labels/1')
          .end((err, res) => {
            assert.deepEqual(res.body, expected);
            done();
          });
      });
  });

  it('should delete a label', done => {
    agent
      .delete('/api2/labels/1')
      .expect(204, testLabelsLength(0, done));
  });

  it('should not login with incorrect credentials', (done) => {
    request(app)
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool2'})
      .set('Accept', 'application/json')
      .expect(401, done);
  });
});