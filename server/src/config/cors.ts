import cors from 'cors';
import { env } from './environment.js';

export const corsOptions: cors.CorsOptions = {
  origin: env.nodeEnv === 'production'
    ? env.clientUrl
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
