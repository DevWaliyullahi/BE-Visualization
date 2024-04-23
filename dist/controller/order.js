"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const order_1 = __importDefault(require("../entity/order"));
const data_source_1 = require("../database/data-source");
// Create an API endpoint that accepts new orders from the form. The endpoint should store the received data. 
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderRepository = data_source_1.AppDataSource.getRepository(order_1.default);
    const newOrder = orderRepository.create(req.body);
    const result = yield orderRepository.save(newOrder);
    res.json(result);
});
exports.createOrder = createOrder;
