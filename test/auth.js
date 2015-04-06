'use strict';

import assert from 'assert';
import request from 'supertest-as-promised';
import sequelizeFixtures from 'sequelize-fixtures';

import timeout from '../utils/timeout';
import models from '../models';

process.env.NODE_ENV = 'test';
process.env.PORT = 3006;

import app from '../server';

describe('auth api', () => {
  before(async () => {
    await timeout(1000);
  });

  beforeEach(async () => {
    await models.sequelize.sync({force: true});
    await sequelizeFixtures.loadFile('./test/fixtures/users.json', models);
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool22'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });


  it('should not login with incorrect credentials', async () => {
    await request(app)
      .post('/api2/auth')
      .send({username: 'timmu', password: 'parool2'})
      .set('Accept', 'application/json')
      .expect(401);
  });

});