// import { Sequelize } from 'sequelize';
import { Asset } from '../models/Asset';
import db from '../models/index';
import { Person, personFactory } from '../models/Person';
import { Token, tokenfactory } from '../models/Token';
import { Category, categoryFactory } from '../models/Category';

describe('should connect to the db', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    // await db.person.update();
  });
  afterAll(async () => {
    db.sequelize.close();
  });

  it('should connect', async () => {
    // console.log('Got db: ', db);
    let hasError = false;
    try {
      await db.sequelize.authenticate();
      const earn = await categoryFactory('earn');
      const custody = await categoryFactory('custody');
      const btc = await tokenfactory('BTC');
      const ada = await tokenfactory('ADA');

      const person = await personFactory('abc', 'Steven G');
      // const person = await Person.create({
      //   schedule: 'abc',
      //   name: 'Steven G',
      // });

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
      // // await PersonToken.create({
      // //   personId: person.id,
      // //   tokenId: btc.id,
      // //   quantity: 1.1,
      // //   // category: earn,
      // // });

      // // TODO query

      // // const find = await PersonToken.findAll({
      // //   where: {
      // //     tokenId: btc.id,
      // //     // token: btc,
      // //   },
      // //   include: [Person, Token],
      // // });
      // // console.log('Found stuff: ', find);
      // // console.log('Token owner: ', find[0].person);
      // // const person
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
  // await db.sequelize.sync({ force: true });
});
