import { signup, login } from '../src/controllers/authController';
import * as poolModule from '../src/db/pool';
import * as authUtils from '../src/utils/auth';

// Mocks
jest.mock('../src/db/pool');
jest.spyOn(authUtils, 'hashPassword').mockResolvedValue('hashed');
jest.spyOn(authUtils, 'verifyPassword').mockResolvedValue(true);
jest.spyOn(authUtils, 'signJwt').mockReturnValue('token');

function createMockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authController', () => {
  afterEach(() => jest.clearAllMocks());

  test('signup creates user and returns token', async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({ rowCount: 0 }) // existing email
        .mockResolvedValueOnce({ rows: [{ id: 'u1', email: 'a@b.com' }] }) // insert user
        .mockResolvedValueOnce({}), // insert wallet
      release: jest.fn()
    } as any;
    (poolModule.pool as any) = { connect: jest.fn().mockResolvedValue(client) };

    const req: any = { body: { email: 'a@b.com', password: 'secret12' } };
    const res = createMockRes();
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ token: 'token', user: { id: 'u1', email: 'a@b.com' } });
  });

  test('login returns token for valid credentials', async () => {
    (poolModule.pool as any) = {
      query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ id: 'u1', email: 'a@b.com', password_hash: 'hashed' }] })
    } as any;

    const req: any = { body: { email: 'a@b.com', password: 'secret12' } };
    const res = createMockRes();
    await login(req, res);
    expect(res.json).toHaveBeenCalledWith({ token: 'token', user: { id: 'u1', email: 'a@b.com' } });
  });
});


