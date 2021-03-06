import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import calculateMiddleware from './app/middlewares/calculate';

import multerConfig from './config/multer';
import MeetupController from './app/controllers/MeetupController';
import MeetupOwnerController from './app/controllers/MeetupOwnerController';
import SubscriptionController from './app/controllers/SubscriptionController';

const upload = multer(multerConfig);

const routes = new Router();

routes.use(calculateMiddleware);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.get('/users', UserController.index);
// auth is required ->
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/file', upload.single('file'), FileController.store);

routes.get('/meetup', MeetupController.index);
routes.post('/meetup', MeetupController.store);
routes.put('/meetup/:id', MeetupController.update);
routes.get('/meetup/:id', MeetupController.show);
routes.delete('/meetup/:id', MeetupController.delete);

routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);

routes.get('/organizer', MeetupOwnerController.index);

routes.get('/subscription', SubscriptionController.index);

export default routes;
