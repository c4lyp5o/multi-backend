import cors from 'cors';
import logger from 'morgan';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';

const app = express();
app.use(json({ limit: '5mb' }));
app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use((_, res, next) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate'
  );
  next();
});

app.use('/v1', indexRouter);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(500).json({
    code: err.status || 500,
    status: 'Not Found.',
    message: `Resource "${req.url}" is not found.`,
    error: err.message,
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: `Hey ${req.ip}, maybe you should go to /v1`,
  });
});

export default app;
