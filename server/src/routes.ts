import express, { response } from 'express';
import { celebrate, Joi } from 'celebrate';
import knex from './database/connection';
import multer from "multer";
import multerConfig from './config/multer';

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController()

routes.get('/', (request, response) => {
    response.send('Invalid Route: Access the Correct Route <a href="http://localhost:81">Here</a>');
});

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points',
    upload.single('image'),
    celebrate({ 
            body: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                whatsapp: Joi.string().required(),
                uf: Joi.string().required().max(2),
                city: Joi.string().required(),
                latitude: Joi.number().required(),
                longitude: Joi.number().required(),
                items: Joi.string().required(),
            })
        },{
            abortEarly: false,
        }),
    pointsController.create
);

export default routes;