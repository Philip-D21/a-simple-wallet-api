import { listTransactions } from '../src/controllers/transactionController';
import * as poolModule from '../src/db/pool';

jest.mock('../src/db/pool');

function resMock() {
  const res: any = {};
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

test('listTransactions returns array', async () => {
  (poolModule.pool as any) = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 't1', type: 'credit', amount: 10, created_at: new Date().toISOString() }] })
  } as any;
  const res = resMock();
  await listTransactions({ user: { id: 'u1', email: 'a@b.com' } } as any, res as any);
  expect(res.json).toHaveBeenCalled();
});


