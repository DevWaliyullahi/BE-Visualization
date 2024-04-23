import createError from "http-errors";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from 'path';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import cors from "cors";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

dotenv.config();

// database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the PostgresSql database successfully");
  })
  .catch((error) => console.log(error));

const app = express();

const frontEndUrl = process.env.FRONTEND_URL;



app.use(
  cors({
    origin: frontEndUrl,
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
  // Set Cache-Control: no-cache for specific routes or all routes
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({ error: err.message });
});

export default app;
