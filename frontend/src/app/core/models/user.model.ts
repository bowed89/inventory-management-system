export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: UserRole;
  createdAt?: string;
}
