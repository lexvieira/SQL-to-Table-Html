import express from 'express';

const routes = express.Router()

routes.get('/', (request, response) => {
    response.send('Invalid Route: Access the Correct Route <a href="http://localhost:3333">Here</a>');
});

export default routes;