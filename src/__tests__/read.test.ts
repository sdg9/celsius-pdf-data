import { parseCrypto, categorizeAssets } from '../read';
it('should do stuff', () => {
  const retVal = categorizeAssets([
    'BCH 0.000003618754105077',
    'SGB 43.8662067821396',
    'USDC 8.096',
    'XLM 0.000978054402582909',
    'XRP 291.062898734206',
  ]);

  // expect(retVal).toEqual({
  //   BCH: 0.000003618754105077,
  //   SGB: 43.8662067821396,
  //   USDC: 8.096,
  //   XLM: 0.000978054402582909,
  //   XRP: 291.062898734206,
  // });
  expect(retVal).toEqual([
    { symbol: 'BCH', qty: 0.000003618754105077 },
    { symbol: 'SGB', qty: 43.8662067821396 },
    { symbol: 'USDC', qty: 8.096 },
    { symbol: 'XLM', qty: 0.000978054402582909 },
    { symbol: 'XRP', qty: 291.062898734206 },
    // SGB: ,
    // USDC: ,
    // XLM: ,
    // XRP: ,
  ]);
});
