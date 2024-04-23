import express  from "express";
import { Request, Response } from "express";
import { createOrder } from "../controller/order";
import { getStats, populateDatabase } from "../controller/stats";

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/order', createOrder);
router.get('/stats', getStats);

router.post('/populate', populateDatabase);

export default router;
