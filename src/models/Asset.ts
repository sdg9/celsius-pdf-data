import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Person } from './Person';
import { Token } from './Token';
import { Category } from './Category';

@Table
export class Asset extends Model {
  @ForeignKey(() => Person)
  @PrimaryKey
  @Column
  schedule: string;

  @ForeignKey(() => Token)
  @PrimaryKey
  @Column
  token: string;

  @ForeignKey(() => Category)
  @PrimaryKey
  @Column
  category: string;

  @Column(DataType.DECIMAL(13, 4))
  quantity: number;

  @BelongsTo(() => Person)
  person: Person[];
}

export const assetFactory = async (
  schedule: string,
  symbol: string,
  quantity: number,
  category: string,
) => {
  const [token, isCreated] = await Token.findOrCreate({
    where: {
      name: symbol,
    },
  });

  return Asset.create({
    schedule,
    tokenSymbol: symbol,
    quantity,
    category,
  });
};

export const assetFactory2 = async (
  schedule: string,
  tokenSymbol: string,
  quantity: number,
  category: string,
) => {
  return Asset.create({
    schedule,
    tokenSymbol,
    quantity,
    category,
  });
};
