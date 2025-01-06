import { DataSourceOptions } from 'typeorm';
import { User } from './entities/User';
import { AttendanceRecord } from './entities/AttendanceRecord';

const ormconfig: DataSourceOptions = 
{
  "type": "mysql",
  "host": process.env.DATABASE_HOST,
  "port": parseInt(process.env.DATABASE_PORT) || 3306,
  "username": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_NAME,
  "synchronize": true,
  "logging": true,
  "entities": [
    User, AttendanceRecord
  ],
  "migrations": [
    "migration/**/*.ts"
  ],
  "subscribers": [
    "subscriber/**/*.ts"
  ]
}

export default ormconfig;