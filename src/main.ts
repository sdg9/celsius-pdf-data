import { Person } from './models/Person';
import { parseFile } from './read';
import db from './models/index';
import { categoryFactory } from './models/Category';
import { Asset } from './models/Asset';
import { Token } from './models/Token';
import tokenPrices from './tokenPrices';

const files = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'UZ',
];

const token = {};

async function getAsset(asset, schedule, category) {
  if (token[asset.symbol] == undefined) {
    const [myToken, isCreated] = await Token.findOrCreate({
      where: {
        symbol: asset.symbol,
      },
    });
    token[asset.symbol] = myToken.symbol;
  }

  if (Number.isFinite(asset.qty)) {
    return {
      schedule,
      token: token[asset.symbol],
      category,
      quantity: asset.qty,
    };
  } else {
    return null;
  }
}

/**
 * Run me to create a database parsed from the data files
 */
async function insertAllData() {
  // init
  await db.sequelize.sync({ force: true });
  const earn = await categoryFactory('earn');
  const custody = await categoryFactory('custody');

  // loop through files
  for (const file of files) {
    const users = parseFile(file);

    const dbUsersArr = [];
    const assetsArr = [];
    for (const user of users) {
      if (user.schedule?.length > 0 && user.name?.length > 0) {
        let totalUSDLoss = 0;
        for (const asset of user.earn ?? []) {
          const myAsset = await getAsset(asset, user.schedule, earn.name);
          if (myAsset != null) {
            assetsArr.push(myAsset);

            const validPrice =
              tokenPrices.data?.[myAsset.token]?.quote?.USD?.price;
            if (isFinite(validPrice)) {
              totalUSDLoss += myAsset.quantity * validPrice;
            }
          }
        }

        for (const asset of user.custody ?? []) {
          const myAsset = await getAsset(asset, user.schedule, custody.name);
          if (myAsset != null) {
            assetsArr.push(myAsset);
            const validPrice =
              tokenPrices.data?.[myAsset.token]?.quote?.USD?.price;
            if (isFinite(validPrice)) {
              totalUSDLoss += myAsset.quantity * validPrice;
            }
          }
        }

        dbUsersArr.push({
          schedule: user.schedule,
          name: user.name,
          address: user.address,
          lossInUSD: totalUSDLoss,
        });
      } else {
        // console.error(`ID: ${user.schedule} name: ${user.name} has null id`);
      }
    }

    await Person.bulkCreate(dbUsersArr);
    await Asset.bulkCreate(assetsArr);

    // await Promise.all([
    //   Person.bulkCreate(dbUsersArr),
    //   Asset.bulkCreate(assetsArr),
    // ]);
    console.log(`Done with ${file}`);
  }
  db.sequelize.close();
}

/**
 * Updates the database with prices as listed in tokenPrices.ts
 */
async function updatePrices() {
  for (const symbol of [
    '1INCH',
    'AAVE',
    'ADA',
    'AVAX',
    'BADGER',
    'BAT',
    'BCH',
    'BNB',
    'BNT',
    'BSV',
    'BTC',
    'BTG',
    'BUSD',
    'CEL',
    'COMP',
    'CRV',
    'CVX',
    'DAI',
    'DASH',
    'DOGE',
    'DOT',
    'EOS',
    'ETC',
    'ETH',
    'GUSD',
    'KNC',
    'LINK',
    'LPT',
    'LTC',
    'LUNC',
    'MANA',
    'MATIC',
    'MCDAI',
    'MKR',
    'OMG',
    'ORBS',
    'PAX',
    'PAXG',
    'SGB',
    'SGR',
    'SNX',
    'SOL',
    'SUSHI',
    'TAUD',
    'TCAD',
    'TGBP',
    'THKD',
    'TUSD',
    'UMA',
    'UNI',
    'USDC',
    'USDT',
    'UST',
    'WBTC',
    'WDGLD',
    'XAUT',
    'XLM',
    'XRP',
    'XTZ',
    'YFI',
    'ZEC',
    'ZRX',
    'ZUSD',
  ]) {
    await Token.update(
      {
        value: tokenPrices.data?.[symbol]?.quote?.USD?.price,
      },
      { where: { symbol } },
    );
  }
}

(async () => {
  await insertAllData();
  // await updatePrices();
  // const tokens = await Token.findAll();
  // console.log('TOKENS: ', tokens);
})();
// parse file
