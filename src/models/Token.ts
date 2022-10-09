import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class Token extends Model {
  @PrimaryKey
  @Column
  symbol: string;

  @Column(DataType.FLOAT)
  @Column
  value: number;
}

export const tokenfactory = (name: string) => {
  return Token.create({ name });
};
