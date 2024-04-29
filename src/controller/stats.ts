import fs from 'fs';
import { createReadStream } from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { Request, Response } from 'express';
import Order from '../entity/order';
import { AppDataSource } from '../database/data-source';

const readCSVAndInsertData = async (filePath: string) => {
    const orderRepository = AppDataSource.getRepository(Order);
    const orders: Order[] = [];

    return new Promise((resolve, reject) => {
        
        createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const order = new Order();
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
                    } else {
                        order.orderDate = new Date(row.order_date);
                    }

                    if (isNaN(order.orderDate.getTime())) {
                        console.error('Invalid date encountered:', row.orderDate);
                    }
                } else {
                    console.error('Missing or empty order_date field in row:', row);
                }

                orders.push(order);
            })
            .on('end', async () => {
                try {

                    await orderRepository.save(orders);
                    
                    resolve(undefined); 
                } catch (error) {
                    console.error('Error inserting data:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
};

export const populateDatabase = async (req: Request, res: Response): Promise<void> => {
    const filePath = path.join(__dirname, '..', 'data', 'mockData.csv');


    try {
        await readCSVAndInsertData(filePath);
        res.json({ message: 'Historical data inserted into database successfully!' });
    } catch (error) {
        console.error('Error populating database:', error);
        res.status(500).json({ error: 'Failed to populate database with historical data' });
    }
};


export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderRepository = AppDataSource.getRepository(Order);
        const orders = await orderRepository.find();

        // Calculate total revenue
        const totalRevenue: number = orders.reduce((acc, order) => acc + Number(order.price), 0);

        // Calculate unique customers
        const uniqueCustomers = new Set(orders.map((order) => order.customerName)).size;

        // Send response
        res.json({
            totalRevenue,
            orders: orders.length,
            customers: uniqueCustomers,
        });
    } catch (error) {
        console.log("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//Enpoint to get all the data from the database

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderRepository = AppDataSource.getRepository(Order);
        const orders = await orderRepository.find();
        res.json(orders);
    } catch (error) {
        console.log("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Endpoint to get orders by product category and its total by length

export const getOrdersByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderRepository = AppDataSource.getRepository(Order);
        const orders = await orderRepository.find();

        const ordersByCategory: { [key: string]: number } = orders.reduce((acc, order) => {
            if (!acc[order.productCategory]) {
                acc[order.productCategory] = 1;
            } else {
                acc[order.productCategory]++;
            }
            return acc;
        }, {} as { [key: string]: number });

        res.json(ordersByCategory);
    } catch (error) {
        console.log("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};