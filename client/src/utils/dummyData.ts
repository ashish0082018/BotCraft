import type { User, Bot, ApiKey, Payment } from '../types/';

export const dummyUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  plan: 'FREE',
  requestsLeft: 750,
  createdAt: '2024-01-15T10:30:00Z',
  apiKey: {
    id: 'api-1',
    key: 'sa-74e0e564-05e6-428f-9620-c949b3d5e242',
    userId: 'user-1'
  },
  bots: [
    {
      id: 'bot-1',
      name: 'Customer Support Bot',
      createdAt: '2024-01-20T14:22:00Z',
      userId: 'user-1'
    },
    {
      id: 'bot-2',
      name: 'FAQ Assistant',
      createdAt: '2024-01-25T09:15:00Z',
      userId: 'user-1'
    }
  ]
};

export const dummyPayments: Payment[] = [
  {
    id: 'payment-1',
    amount: 29.99,
    status: 'SUCCESS',
    createdAt: '2024-01-10T16:45:00Z',
    userId: 'user-1'
  },
  {
    id: 'payment-2',
    amount: 29.99,
    status: 'SUCCESS',
    createdAt: '2024-02-10T11:30:00Z',
    userId: 'user-1'
  }
];