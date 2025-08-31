export interface User {
    id: string;
    name: string;
    email: string;
    plan: 'FREE' | 'PRO';
    requestsLeft: number;
    createdAt: string;
    apiKey: ApiKey;
    bots: Bot[];
  }
  
  export interface Bot {
    id: string;
    name: string;
    createdAt: string;
    userId: string;
  }
  
  export interface ApiKey {
    id: string;
    key: string;
    userId: string;
  }
  
  export interface Payment {
    id: string;
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    createdAt: string;
    userId: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }