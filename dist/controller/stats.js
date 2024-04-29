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
exports.getStats = exports.populateDatabase = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const order_1 = __importDefault(require("../entity/order"));
const data_source_1 = require("../database/data-source");
const readCSVAndInsertData = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const orderRepository = data_source_1.AppDataSource.getRepository(order_1.default);
    const orders = [];
    return new Promise((resolve, reject) => {
        (0, fs_1.createReadStream)(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const order = new order_1.default();
            order.customerName = row.customer_name;
            order.productName = row.product_name;
            order.productCategory = row.product_category;
            order.price = parseFloat(row.price);
            order.orderDate = new Date(row.order_date);
            // Checking if orderDate exists and is not empty
            if (row.order_date && row.order_date.trim() !== "") {
                // formatting the order date
                if (row.order_date.includes("/")) {
                    const [day, month, year] = row.order_date.split('/');
                    order.orderDate = new Date(`${year}-${month}-${day}`);
                }
                else {
                    order.orderDate = new Date(row.order_date);
                }
                if (isNaN(order.orderDate.getTime())) {
                    console.error('Invalid date encountered:', row.orderDate);
                }
            }
            else {
                console.error('Missing or empty order_date field in row:', row);
            }
            orders.push(order);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield orderRepository.save(orders);
                resolve(undefined);
            }
            catch (error) {
                console.error('Error inserting data:', error);
                reject(error);
            }
        }))
            .on('error', (error) => {
            console.error('Error reading CSV:', error);
            reject(error);
        });
    });
});
const populateDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, '..', 'data', 'mockData.csv');
    try {
        yield readCSVAndInsertData(filePath);
        res.json({ message: 'Historical data inserted into database successfully!' });
    }
    catch (error) {
        console.error('Error populating database:', error);
        res.status(500).json({ error: 'Failed to populate database with historical data' });
    }
});
exports.populateDatabase = populateDatabase;
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderRepository = data_source_1.AppDataSource.getRepository(order_1.default);
        const orders = yield orderRepository.find();
        // Calculate total revenue
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.price), 0);
        // Calculate unique customers
        const uniqueCustomers = new Set(orders.map((order) => order.customerName)).size;
        // Send response
        res.json({
            totalRevenue,
            orders: orders.length,
            customers: uniqueCustomers,
        });
    }
    catch (error) {
        console.log("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getStats = getStats;
