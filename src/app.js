import 'dotenv/config';
import express from 'express';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  routes() {
    this.server.use(routes);
  }

  middlewares() {
    this.server.use(express.json());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const erros = await new Youch(err, req).toJSON();
        return res.status(500).json(erros);
      }
      return res.status(500).json({ error: 'Internal server error dsds' });
    });
  }
}

export default new App().server;
