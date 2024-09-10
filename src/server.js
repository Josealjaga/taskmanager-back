import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { createServer, } from 'http';
import usersRouter from './routes/users.routes.js';
import tasksRouter from './routes/tasks.routes.js';
import authenticationMiddleware from './middlewares/authentication.middleware.js';
import authRouter from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url'
function bootstrap() {
  const app = express();
  const port = +process.env.APP_PORT ?? 3000;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const corsOptions = {
    origin: 'https://taskmanager-front-beta.vercel.app',
    optionsSuccessStatus: 200 
  };
  app.use(cors(corsOptions));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use('/uploads', express.static('uploads'));

  app.use('/users', authenticationMiddleware, usersRouter);
  app.use('/tasks', authenticationMiddleware, tasksRouter);
  app.use('/auth', authRouter);

  const httServer = createServer(app);
  httServer.listen(port, () => {
    console.log('Server running on port: ', port);
  });
}
bootstrap();
