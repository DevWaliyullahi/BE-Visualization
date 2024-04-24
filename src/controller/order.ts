import { Request, Response } from "express";
import Order from "../entity/order";
import { AppDataSource } from "../database/data-source";

// Create an API endpoint that accepts new orders from the form. The endpoint should store the received data. 

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const newOrder = orderRepository.create(req.body);
      
      const result = await orderRepository.save(newOrder);
      
      // Sending a success response to the frontend with the created order data
      res.json({ success: true, order: result });

      // handle error
    } catch (error) {

      let errorMessage = 'An error occurred while creating the order.';
  
      if (error instanceof Error && error.message) {
        errorMessage += ` Reason: ${error.message}`;
      } else if (typeof error === 'string') {
        
        errorMessage += ` Reason: ${error}`;
      }
      
      res.status(500).json({ success: false, error: errorMessage });
    }
};