import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import calculateMiddleware from './app/middlewares/calculate';

import multerConfig from './config/multer';
import MeetupController from './app/controllers/MeetupController';

const upload = multer(multerConfig);

const routes = new Router();

routes.use(calculateMiddleware);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

// auth is required ->
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/file', upload.single('file'), FileController.store);

routes.get('/meetup', MeetupController.index);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup/:id', MeetupController.update);
routes.get('/meetup/:id', MeetupController.show);
routes.delete('/meetup/:id', MeetupController.delete);

export default routes;
