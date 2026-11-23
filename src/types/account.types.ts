
export interface Account {
  bankId: number;
  bankName: string;
  accountType: string;
  openingBalance: number;
  currency: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountPayload {
  bankName: string;
  accountType: string;
  openingBalance: number;
  currency: string;
  isActive: boolean;
}
