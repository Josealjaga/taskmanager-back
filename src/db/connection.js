import { Sequelize, } from 'sequelize';

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = +process.env.DB_PORT;
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;

const sequelize = new Sequelize(
  DB_DATABASE_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  {
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
     dialectOptions: {
       ssl: {
         require: true,
         rejectUnauthorized: false
       }
     }
  },
  
);

try {
  await sequelize.authenticate();
  console.log('Connected to database');
} catch (err) {
  console.error('Error to connect to database: ', err);
}

export {
  sequelize,
}