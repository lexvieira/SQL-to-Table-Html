import knex from 'knex';

const connection = knex({
    client: 'mssql',
    connection: {
      host : '192.168.43.108',
      user : 'SA',
      password : 'JHu@hGTWSK@9t63',
      database : 'MY_DB'
    }
});
  


export default connection;
  