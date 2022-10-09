import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table
export class Category extends Model {
  @PrimaryKey
  @Column
  name: string;
}

export const categoryFactory = (name: string) => {
  return Category.create({ name });
};
