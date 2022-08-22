import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.all('/', async (req, res) => {
  res.send('Hello World!');
});
app.all('*', async (req, res) => {
  res
    .status(404)
    .send(`Hello ${req.ip}.\n\nNothing here. Maybe its being built.`);
});
app.use('/v1', indexRouter);

export default app;
