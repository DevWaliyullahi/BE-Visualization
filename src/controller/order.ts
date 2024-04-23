import { Request, Response } from "express";
import Order from "../entity/order";
import { AppDataSource } from "../database/data-source";

// Create an API endpoint that accepts new orders from the form. The endpoint should store the received data. 

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const orderRepository = AppDataSource.getRepository(Order);
  const newOrder = orderRepository.create(req.body);
  const result = await orderRepository.save(newOrder);
  res.json(result);
};


