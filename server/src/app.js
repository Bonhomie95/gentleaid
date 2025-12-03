import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// ---------- Global Middlewares ----------
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Limit OTP brute force
app.use(
  '/api/auth/send-otp',
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: 'Too many OTP requests. Try again shortly.',
  })
);

// ---------- Routes ----------
app.use('/api', routes);

// ---------- Error Handler ----------
app.use(errorHandler);

export default app;
