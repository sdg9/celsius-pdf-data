import { Sequelize } from 'sequelize-typescript';

import { Person } from './Person';
import { Token } from './Token';

const env = process.env.NODE_ENV || 'development';
import myConfig from '../config/config';
import { Category } from './Category';
import { Asset } from './Asset';
const config = myConfig[env];

export interface DbInterface {
  sequelize: Sequelize;
  person: Person;
  token: Token;
  tokenCategory: Category;
  asset: Asset;
  [key: string]: any;
}
const db: any = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

//Models
db.person = Person;
db.token = Token;
db.asset = Asset;
db.tokenCategory = Category;
sequelize.addModels([Person, Token, Asset, Category]);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const dbTyped: DbInterface = db;

export default dbTyped;
