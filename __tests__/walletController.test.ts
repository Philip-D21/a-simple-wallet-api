import { getBalance, credit, debit } from '../src/controllers/walletController';
import * as poolModule from '../src/db/pool';

jest.mock('../src/db/pool');

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const userReq = (id = 'u1') => ({ user: { id, email: 'a@b.com' } } as any);

describe('walletController', () => {
  afterEach(() => jest.clearAllMocks());

  test('getBalance returns number', async () => {
    (poolModule.pool as any) = { query: jest.fn().mockResolvedValue({ rows: [{ balance: 10 }] }) } as any;
    const res = mockRes();
    await getBalance(userReq(), res);
    expect(res.json).toHaveBeenCalledWith({ balance: 10 });
  });

  test('credit updates balance and creates transaction', async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({}),
      release: jest.fn()
    } as any;
    (poolModule.pool as any) = { connect: jest.fn().mockResolvedValue(client) } as any;
    const res = mockRes();
    await credit({ body: { amount: 5 }, ...userReq() } as any, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('debit fails on insufficient funds', async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ balance: 1 }] }),
      release: jest.fn()
    } as any;
    (poolModule.pool as any) = { connect: jest.fn().mockResolvedValue(client) } as any;
    const res = mockRes();
    await debit({ body: { amount: 5 }, ...userReq() } as any, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});


