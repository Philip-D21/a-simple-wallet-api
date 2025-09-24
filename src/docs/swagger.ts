import { OpenAPIV3 } from 'openapi-types';

const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: { title: 'Wallet API', version: '1.0.0' },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      AuthRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password_hash: { type: 'string', minLength: 6 }
        },
        required: ['email', 'password_hash']
      },
      TokenResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: { id: { type: 'string' }, email: { type: 'string' } },
            required: ['id', 'email']
          }
        },
        required: ['token', 'user']
      },
      AmountRequest: {
        type: 'object',
        properties: { amount: { type: 'number', minimum: 0.0000001 } },
        required: ['amount']
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRequest' } } }
        },
        responses: {
          '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          '400': { description: 'Validation error' },
          '409': { description: 'Email already registered' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRequest' } } }
        },
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          '400': { description: 'Validation error' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/wallet/balance': {
      get: {
        tags: ['Wallet'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current balance',
            content: { 'application/json': { schema: { type: 'object', properties: { balance: { type: 'number' } }, required: ['balance'] } } }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/wallet/credit': {
      post: {
        tags: ['Wallet'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AmountRequest' } } } },
        responses: { '201': { description: 'credited' }, '400': { description: 'Validation error' }, '401': { description: 'Unauthorized' } }
      }
    },
    '/wallet/debit': {
      post: {
        tags: ['Wallet'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AmountRequest' } } } },
        responses: { '201': { description: 'debited' }, '400': { description: 'Insufficient funds or validation error' }, '401': { description: 'Unauthorized' } }
      }
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Transaction history',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transactions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          type: { type: 'string', enum: ['credit', 'debit'] },
                          amount: { type: 'number' },
                          created_at: { type: 'string', format: 'date-time' }
                        },
                        required: ['id', 'type', 'amount', 'created_at']
                      }
                    }
                  },
                  required: ['transactions']
                }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

export const swaggerSpec = spec;


