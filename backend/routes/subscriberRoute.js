import express from 'express';
import { subscribeNewsletter, unsubscribeNewsletter, getAllSubscribers } from '../controllers/subscriberController.js';
import adminAuth from '../middleware/adminAuth.js';

const subscriberRouter = express.Router();

subscriberRouter.post('/subscribe', subscribeNewsletter);
subscriberRouter.post('/unsubscribe', unsubscribeNewsletter);
subscriberRouter.get('/subscribers', adminAuth, getAllSubscribers);

export default subscriberRouter;
