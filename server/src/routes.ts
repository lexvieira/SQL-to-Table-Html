import express, { response } from 'express';
import knex from './database/connection';

import PointsController from "./controllers/PointsController";
import  ItemsController  from "./controllers/ItemsController";

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController()

routes.get('/', (request, response) => {
    response.send('Invalid Route: Access the Correct Route <a href="http://localhost:3333">Here</a>');
});

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.post('/points', pointsController.create);
routes.get('/points/:id', pointsController.show);

export default routes;