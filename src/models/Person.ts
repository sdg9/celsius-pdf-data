import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { Asset } from './Asset';

@Table
export class Person extends Model {
  @PrimaryKey
  @Column
  schedule: string;

  @Column
  name: string;

  @Column
  address: string;

  @Column(DataType.DECIMAL(13, 2))
  lossInUSD: number;

  @HasMany(() => Asset)
  assets: Asset[];
}

export const personFactory = (schedule: string, name: string) => {
  return Person.create({
    // id: schedule,
    schedule,
    name,
  });
};
