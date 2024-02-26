import { DataSource } from 'typeorm';
import 'reflect-metadata';
import ormconfig from './ormconfig';
import Holder from '@/lib/Holder';

let AppDataSource:DataSource | undefined;
export const connectionHolder = new Holder(); 

export const getDataSource  = () => {
  if (!AppDataSource) {
    AppDataSource = new DataSource(ormconfig);
    console.log(`create DataSource`);
    AppDataSource.initialize().then(() => {
      console.log(`connect complete`);
      connectionHolder.resolve();
    });
  }
  return AppDataSource;
};