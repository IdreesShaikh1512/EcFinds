import { Router, RequestHandler } from "express";
import { readJson, writeJson, nowISO, newId } from "../data/store";
import crypto from "crypto";
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  User,
} from "@shared/api";

const usersKey = "users";
let sessions = new Map<string, string>(); // token -> userId

async function getUsers(): Promise<User[]> {
  return readJson<User[]>(usersKey, []);
}
async function saveUsers(users: User[]) {
  return writeJson(usersKey, users);
}

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}
async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey));
    });
  });
}

export const authRouter = Router();

const issueToken = (userId: string) => {
  const token = newId("tok");
  sessions.set(token, userId);
  return token;
};

const setAuthCookie = (res: any, token: string) => {
  res.cookie("ecofinds_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = (req.headers["authorization"]
    ?.toString()
    .replace("Bearer ", "") || (req as any).cookies?.ecofinds_token) as
    | string
    | undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const userId = sessions.get(token);
  if (!userId) return res.status(401).json({ error: "Invalid session" });
  (req as any).userId = userId;
  next();
};

authRouter.post("/register", (async (req, res) => {
  const body = req.body as AuthRegisterRequest;
  if (!body?.email || !body?.password || !body?.username) {
    return res
      .status(400)
      .json({ error: "email, password, username required" });
  }
  const users = await getUsers();
  if (users.find((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const passwordHash = await hashPassword(body.password);
  const user: User = {
    id: newId("usr"),
    email: body.email,
    username: body.username,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    totalSold: 0,
    totalBought: 0,
  };
  const usersToSave = [...users, { ...user, passwordHash }];
  await saveUsers(usersToSave);
  const token = issueToken(user.id);
  setAuthCookie(res, token);
  const resp: AuthResponse = { token, user };
  res.json(resp);
}) as RequestHandler);

authRouter.post("/login", (async (req, res) => {
  const body = req.body as AuthLoginRequest;
  if (!body?.email || !body?.password) {
    return res.status(400).json({ error: "email and password required" });
  }
  const users = await getUsers();
  const user = users.find(
    (u: any) => u.email.toLowerCase() === body.email.toLowerCase(),
  );
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const publicUser: User = { ...user, passwordHash: undefined } as any;
  const token = issueToken(user.id);
  setAuthCookie(res, token);
  const resp: AuthResponse = { token, user: publicUser };
  res.json(resp);
}) as RequestHandler);

authRouter.get("/me", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const users = await getUsers();
  const found = users.find((u) => u.id === userId);
  if (!found) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...publicUser } = found as any;
  res.json(publicUser);
}) as RequestHandler);

authRouter.put("/me", requireAuth, (async (req, res) => {
  const userId = (req as any).userId as string;
  const update = req.body as Partial<User>;
  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const current = users[idx];
  const updated: User & { passwordHash?: string } = {
    ...current,
    username: update.username ?? current.username,
    updatedAt: nowISO(),
  };
  users[idx] = updated;
  await saveUsers(users);
  const { passwordHash, ...publicUser } = updated as any;
  res.json(publicUser);
}) as RequestHandler);

authRouter.post("/logout", requireAuth, (async (req, res) => {
  const token = (req.headers["authorization"]
    ?.toString()
    .replace("Bearer ", "") || (req as any).cookies?.ecofinds_token) as string;
  if (token) sessions.delete(token);
  res.clearCookie("ecofinds_token");
  res.json({ ok: true });
}) as RequestHandler);
