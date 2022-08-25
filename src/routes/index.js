import express from 'express';
import { welcomeMessage } from '../settings';
import { listData, sendData } from '../controllers/db';
import { logToFile, displayLogFile, clearAllLogs } from '../controllers/logger';
import { echoService } from '../controllers/echo';

const Router = express.Router();

// hello world
Router.get('/', (req, res) =>
  res.status(200).json({ message: welcomeMessage })
);

// db func
Router.get('/list', listData);
Router.post('/send', sendData);

// logger func
Router.post('/log', logToFile);
Router.get('/log', displayLogFile);
Router.get('/clearlogs', clearAllLogs);

// echo func
Router.get('/echo', echoService);

export default Router;
