// import { Sequelize } from 'sequelize';
import { Asset } from '../models/Asset';
import db from '../models/index';
import { Person } from '../models/Person';
import { Token } from '../models/Token';
import { Category } from '../models/Category';

describe('should import data to db', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });
  afterAll(async () => {
    db.sequelize.close();
  });

  it('read', async () => {
    // console.log('Got db: ', db);
    let hasError = false;
    try {
      await db.sequelize.authenticate();

      const earn = await Category.create({ name: 'earn' });
      const custody = await Category.create({ name: 'custody' });
      const btc = await Token.create({ name: 'BTC' });
      const ada = await Token.create({ name: 'ADA' });

      const person = await Person.create({
        schedule: 'abc',
        name: 'John D',
      });

      const asset1 = await Asset.create({
        personId: person.id,
        tokenId: btc.id,
        categoryId: earn.id,
        quantity: 1.234,
      });
      const asset2 = await Asset.create({
        personId: person.id,
        tokenId: ada.id,
        categoryId: custody.id,
        quantity: 101231.1,
      });

      const personFound = await Person.findOne({
        where: {
          id: 1,
        },
        include: [Asset],
      });
      console.log('Found person with assets: ', personFound.assets);

      console.log('Connection has been established successfully.');
    } catch (error) {
      hasError = true;
      console.error('Unable to connect to the database:', error);
    }
    expect(hasError).toBe(false);
  });
});
