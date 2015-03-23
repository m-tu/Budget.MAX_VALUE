import express from 'express';
let router = express.Router();

router.route('/labels')
  .get((req, res) => {
    res.json([
      {
        "id": 1,
        "name": "Food"
      },
      {
        "id": 2,
        "name": "Drink"
      }
    ]);
  });

export default router;