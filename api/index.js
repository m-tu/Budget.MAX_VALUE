import express from 'express';

import labels from './labels';

let api = express.Router();

api.use('/labels', labels);

api.use((req, res) => {
  res.sendStatus(404);
})

export default api;