import knex from 'knex';

const connection = knex({
    client: 'mssql',
    connection: {
      host : 'localhost',
      user : 'SA',
      password : 'JHu@hGTWSK@9t63',
      database : 'MY_DB'
    }
});
  
export default connection;
  