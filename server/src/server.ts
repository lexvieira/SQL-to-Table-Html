import express, { request, response } from 'express';

const app = express()

app.use(express.json());

app.get('/', (request, response) => {
    console.log('Helloooooo');
    response.json(['Hellooo world1', 'Hellooo world2', 'Hellooo world3']);
});

const users = [
    'Diego',
    'Cleiton',
    'Robson',
    'Andre',
    'Luis'
]

app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
})
 
app.get('/users', (request, response) => {
    const search = String(request.query.search);

    const filteredUsers = search ?  users.filter(user => user.includes(search)) : users;

    return response.json(filteredUsers);
});


app.post('/users', (request, response) => {
    const data = request.body;

    const user = {
        name: data.name,
        email: data.email,
    };
    return response.json(user);
});
app.listen(3333);