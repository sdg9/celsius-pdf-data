import xlsx from 'node-xlsx';

/**
 * Raw asset cell to token object
 * @param data
 * @returns
 */
export function parseCrypto(data: string): Asset[] {
  if (data != undefined) {
    const assets = data.split('\r\n');
    return categorizeAssets(assets);
  }
  return undefined;
}

const totalTokens = {};

/**
 * Array of tokens as text to object
 * @param data
 * @returns
 */
export function categorizeAssets(data: string[]): Asset[] {
  const assets = data.reduce((acc, curr) => {
    const [token, qtyStr] = curr.split(' ');
    totalTokens[token] = 1;
    const qty = parseFloat(qtyStr);
    acc.push({ symbol: token, qty });

    return acc;
  }, []);

  return assets;
}

interface Asset {
  symbol: string;
  qty: number;
}

interface User {
  schedule: string;
  address: string;
  name: string;
  earn: Asset[];
  custody: Asset[];
}

// const users: User[] = [];

/**
 * Parse excel file
 */
export function parseFile(file: string) {
  const users: User[] = [];
  const workSheetsFromFile = xlsx.parse(`${__dirname}/../data/${file}.xlsx`);
  const data = workSheetsFromFile[0].data;
  let SCHEDULE = 0;
  let ADDRESS = 2;
  let NAME = 1;
  let EARN = 5;
  let CUSTODY = 6;

  for (const row of data) {
    const rowArray = row as string[];

    if (rowArray?.includes('SCHEDULE F LINE')) {
      SCHEDULE = rowArray.findIndex((val) => val == 'SCHEDULE F LINE');
      NAME = rowArray.findIndex((val) => val == 'CREDITORS NAME');
      ADDRESS = rowArray.findIndex((val) => val == 'ADDRESS');
      EARN = rowArray.findIndex((val) => val == 'EARN ACCOUNT');
      CUSTODY = rowArray.findIndex((val) => val == 'CUSTODY ACCOUNT');
      // skip headings
      console.log('Hone in on headings...');
    } else {
      const schedule: string = rowArray?.[SCHEDULE];
      const name: string = rowArray?.[NAME];
      if (name == null) {
        console.error('Unable to parse name');
      }
      const address: string = rowArray?.[ADDRESS];
      const isDisputedContingentOrUnliquidated: string = rowArray?.[3];
      const isSubjectToOffset: string = rowArray?.[4];
      const earn: string = rowArray?.[EARN];
      const custody: string = rowArray?.[CUSTODY];
      const withheld: string = rowArray?.[7];
      const collateral: string = rowArray?.[8];

      const earnTokens = parseCrypto(earn);
      const custodyTokens = parseCrypto(custody);

      users.push({
        schedule,
        name,
        address,
        earn: earnTokens,
        custody: custodyTokens,
      });
    }
  }
  return users;
}
