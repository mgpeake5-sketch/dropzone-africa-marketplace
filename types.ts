
export enum UserRole {
  Buyer = 'Buyer',
  Seller = 'Seller',
  Admin = 'Admin',
}

export enum ProductStatus {
  Active = 'Active',
  Sold = 'Sold',
  Pending = 'Pending',
}

export enum Condition {
  New = 'New with box',
  NewOther = 'New without box',
  NewWithDefects = 'New with defects',
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: UserRole;
  location: string;
  phone: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  brand: string;
  size: number;
  condition: Condition;
  priceUSD: number;
  sellerId: string;
  createdAt: string;
  status: ProductStatus;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalUSD: number;
  totalZAR: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}
