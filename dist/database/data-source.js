"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const order_1 = __importDefault(require("../entity/order"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DB_CONNECTION_URL,
    synchronize: true,
    logging: false,
    entities: [
        order_1.default,
    ],
    subscribers: [],
    migrations: [],
    extra: {
        timezone: "local",
    },
});
