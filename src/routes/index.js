import express from 'express';
import { testEnvironmentVariable } from '../settings';
import { listData, sendData, sendDataMongo } from '../controllers/db';
import { logToFile, displayLogFile } from '../controllers/logger';

const Router = express.Router();

// hello world
Router.get('/', (req, res) =>
  res.status(200).json({ message: testEnvironmentVariable })
);

// db func
Router.get('/list/:msg', listData);
Router.get('/send', sendData);
Router.get('/sendMongo', sendDataMongo);

// logger func
// Router.use(logToFile);  // middleware
Router.post('/log', logToFile);
Router.get('/log', displayLogFile);

export default Router;
