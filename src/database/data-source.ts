import { DataSource } from "typeorm";
import  Order  from "../entity/order";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_CONNECTION_URL,
  synchronize: true,
  logging: false,
  entities: [
    Order,
  ],
  subscribers: [],
  migrations: [],
  extra: {
    timezone: "local",
  },
});
