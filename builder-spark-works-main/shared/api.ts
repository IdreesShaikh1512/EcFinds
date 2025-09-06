/**
 * Shared types for EcoFinds app
 */

export interface DemoResponse {
  message: string;
}

export type ID = string;

export type Category =
  | "Electronics"
  | "Home Appliances"
  | "Clothing & Fashion"
  | "Furniture & Decor"
  | "Books & Media"
  | "Sports & Fitness"
  | "Beauty & Personal Care"
  | "Groceries & Food"
  | "Automotive"
  | "Health & Wellness"
  | "Toys & Games"
  | "Office & Stationery"
  | "Jewelry & Accessories"
  | "Garden & Outdoor"
  | "Other";

export interface User {
  id: ID;
  email: string;
  username: string;
  passwordHash?: string; // server-only
  createdAt: string; // ISO
  updatedAt: string; // ISO
  totalSold: number;
  totalBought: number;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  username: string;
}
export interface AuthLoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: ID;
  ownerId: ID;
  title: string;
  description: string;
  category: Category;
  price: number; // in currency units
  imageUrl: string; // placeholder allowed
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  category: Category;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductQuery {
  q?: string;
  category?: Category;
}

export interface CartItem {
  productId: ID;
  addedAt: string;
}

export interface Purchase {
  id: ID;
  buyerId: ID;
  sellerId: ID;
  productId: ID;
  price: number;
  purchasedAt: string;
}

export interface LeaderboardEntry {
  userId: ID;
  username: string;
  count: number;
}
export interface LeaderboardResponse {
  topSellers: LeaderboardEntry[];
  topBuyers: LeaderboardEntry[];
}

export interface AIPriceSuggestRequest {
  title: string;
  category: Category;
  listedPrice: number;
  quality: number; // 0..1
}
export interface AIPriceSuggestResponse {
  fairPrice: number;
  marketPrice: number;
  qualityAdjusted: number;
  savings: {
    carbonKg: number;
    timeHours: number;
    wasteKg: number;
  };
  rationale: string;
}
