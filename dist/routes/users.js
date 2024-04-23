"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../controller/order");
const stats_1 = require("../controller/stats");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/order', order_1.createOrder);
router.get('/stats', stats_1.getStats);
router.post('/populate', stats_1.populateDatabase);
exports.default = router;
