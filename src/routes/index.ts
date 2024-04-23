import express from "express";


const router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send( 'Hello from your API!' );
});

export default router;
