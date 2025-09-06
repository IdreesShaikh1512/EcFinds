import { Router, RequestHandler } from "express";
import { readJson, writeJson, newId, nowISO } from "../data/store";
import { requireAuth } from "./auth";
import type {
  CartItem,
  LeaderboardEntry,
  LeaderboardResponse,
  Product,
  Purchase,
  User,
} from "@shared/api";

const cartsKey = "carts"; // map userId -> CartItem[]
const purchasesKey = "purchases"; // Purchase[]
const usersKey = "users";
const productsKey = "products";

async function getCarts(): Promise<Record<string, CartItem[]>> {
  return readJson<Record<string, CartItem[]>>(cartsKey, {});
}
async function saveCarts(carts: Record<string, CartItem[]>) {
  return writeJson(cartsKey, carts);
}
async function getPurchases(): Promise<Purchase[]> {
  return readJson<Purchase[]>(purchasesKey, []);
}
async function savePurchases(items: Purchase[]) {
  return writeJson(purchasesKey, items);
}
async function getUsers(): Promise<(User & { passwordHash?: string })[]> {
  return readJson(usersKey, []);
}
async function saveUsers(users: (User & { passwordHash?: string })[]) {
  return writeJson(usersKey, users);
}
async function getProducts(): Promise<Product[]> {
  return readJson(productsKey, []);
}
async function saveProducts(products: Product[]) {
  return writeJson(productsKey, products);
}

export const commerceRouter = Router();

// Cart endpoints
commerceRouter.get("/cart", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const carts = await getCarts();
  res.json(carts[userId] || []);
}) as RequestHandler);

commerceRouter.post("/cart", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const { productId } = req.body as { productId: string };
  if (!productId) return res.status(400).json({ error: "productId required" });
  const carts = await getCarts();
  const items = carts[userId] || [];
  if (!items.find((i) => i.productId === productId)) {
    items.push({ productId, addedAt: nowISO() });
  }
  carts[userId] = items;
  await saveCarts(carts);
  res.json(items);
}) as RequestHandler);

commerceRouter.delete("/cart/:productId", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const productId = req.params.productId;
  const carts = await getCarts();
  const items = carts[userId] || [];
  carts[userId] = items.filter((i) => i.productId !== productId);
  await saveCarts(carts);
  res.json(carts[userId]);
}) as RequestHandler);

// Checkout: convert cart items into purchases and update leaderboards (users totals)
commerceRouter.post("/checkout", requireAuth, (async (req, res) => {
  const buyerId = (req as any).userId as string;
  const carts = await getCarts();
  const cart = carts[buyerId] || [];
  if (cart.length === 0)
    return res.status(400).json({ error: "Cart is empty" });
  const products = await getProducts();
  const users = await getUsers();
  const purchases = await getPurchases();

  const created: Purchase[] = [];
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const sellerId = product.ownerId;
    const purchase: Purchase = {
      id: newId("pur"),
      buyerId,
      sellerId,
      productId: product.id,
      price: product.price,
      purchasedAt: nowISO(),
    };
    created.push(purchase);
    // remove product from listings
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx !== -1) products.splice(idx, 1);
    // update user totals
    const seller = users.find((u) => u.id === sellerId);
    if (seller) seller.totalSold += 1;
    const buyer = users.find((u) => u.id === buyerId);
    if (buyer) buyer.totalBought += 1;
  }

  carts[buyerId] = [];
  await Promise.all([
    saveCarts(carts),
    saveProducts(products),
    saveUsers(users as any),
    savePurchases([...purchases, ...created]),
  ]);

  res.json({ ok: true, purchases: created });
}) as RequestHandler);

// Previous purchases
commerceRouter.get("/purchases", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const purchases = await getPurchases();
  const mine = purchases.filter((p) => p.buyerId === userId);
  res.json(mine.sort((a, b) => (a.purchasedAt < b.purchasedAt ? 1 : -1)));
}) as RequestHandler);

// Leaderboards
commerceRouter.get("/leaderboard", (async (_req, res) => {
  const users = await getUsers();
  const topSellers: LeaderboardEntry[] = users
    .map((u) => ({ userId: u.id, username: u.username, count: u.totalSold }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const topBuyers: LeaderboardEntry[] = users
    .map((u) => ({ userId: u.id, username: u.username, count: u.totalBought }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const resp: LeaderboardResponse = { topSellers, topBuyers };
  res.json(resp);
}) as RequestHandler);
