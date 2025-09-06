import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  AIPriceSuggestResponse,
  Category,
  CreateProductRequest,
  LeaderboardResponse,
  Product,
  User,
} from "@shared/api";

const CATEGORIES: Category[] = [
  "Electronics",
  "Home Appliances",
  "Clothing & Fashion",
  "Furniture & Decor",
  "Books & Media",
  "Sports & Fitness",
  "Beauty & Personal Care",
  "Groceries & Food",
  "Automotive",
  "Health & Wellness",
  "Toys & Games",
  "Office & Stationery",
  "Jewelry & Accessories",
  "Garden & Outdoor",
  "Other",
];

export default function Index() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("ecofinds_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("ecofinds_token"),
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "">(searchParams.get("category") as Category || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );

  async function fetchProducts() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = (await res.json()) as Product[];
    setProducts(data);
  }
  async function fetchLeaderboard() {
    const res = await fetch("/api/leaderboard");
    setLeaderboard((await res.json()) as LeaderboardResponse);
  }

  useEffect(() => {
    fetchProducts();
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setTimeout(fetchProducts, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category]);

  // Update URL when category changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category) {
      newSearchParams.set("category", category);
    } else {
      newSearchParams.delete("category");
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [category, searchParams, setSearchParams]);

  return (
    <div className="py-10">
      <Hero user={user} />

      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto]">
        <div className="flex gap-6">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
            <div className="relative">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="🔍 Search for sustainable products..."
                className="h-14 pl-6 pr-12 text-lg border-2 border-white/20 focus:border-pink-400 rounded-2xl shadow-2xl focus:shadow-pink-500/25 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:bg-white/20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="h-6 w-6 text-pink-400">🔍</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
            <select
              value={category}
              onChange={(e) => {
                const newCategory = (e.target.value as Category) || "";
                setCategory(newCategory);
              }}
              className="relative h-14 rounded-2xl border-2 border-white/20 focus:border-cyan-400 bg-white/10 backdrop-blur-sm px-6 text-lg font-medium shadow-2xl focus:shadow-cyan-500/25 transition-all duration-300 min-w-[200px] text-white focus:bg-white/20"
            >
              <option value="" className="bg-gray-800 text-white">🎯 All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-800 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="justify-self-end">
          <AddProductButton
            user={user}
            token={token}
            onAdded={fetchProducts}
          />
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center text-emerald-900/70 py-16 border border-dashed rounded-lg">
            No results. Try adjusting filters or add a product.
          </div>
        )}
      </section>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIAdvisor />
        <Leaderboards data={leaderboard} />
      </div>
    </div>
  );
}

function Hero({ user }: { user: User | null }) {
  return (
    <section className="relative rounded-3xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl overflow-hidden group">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full translate-y-40 -translate-x-40 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
              Buy & Sell Smarter with
              <span className="block text-transparent bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text animate-pulse">
                EcoFinds
              </span>
            </h1>
            <div className="h-2 w-32 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full shadow-lg shadow-pink-500/50"></div>
          </div>
          <p className="text-2xl text-white/90 max-w-2xl leading-relaxed font-medium">
            List second-hand items, get AI price guidance, and track your
            <span className="text-transparent bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text font-bold"> positive impact on the planet.</span>
          </p>
          <div className="flex items-center gap-8 text-white/80">
            <div className="flex items-center gap-3 group">
              <div className="h-3 w-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <span className="font-bold text-lg">35+ Products</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="h-3 w-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <span className="font-bold text-lg">15 Categories</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="h-3 w-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <span className="font-bold text-lg">AI-Powered</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-center group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center text-white font-black text-3xl mb-3 mx-auto group-hover:scale-110 transition-all duration-300 shadow-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="text-white/90 font-bold text-xl group-hover:text-white transition-colors duration-300">Welcome back, {user.username}!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AddProductButton({
  user,
  token,
  onAdded,
}: {
  user: User | null;
  token: string | null;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"></div>
          <Button className="relative h-14 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95">
            <span className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Add Product</span>
              <span className="text-2xl">✨</span>
            </span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-emerald-900">Add New Product</DialogTitle>
        </DialogHeader>
        <AddProductForm
          token={token!}
          onDone={() => {
            setOpen(false);
            onAdded();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddProductForm({
  token,
  onDone,
}: {
  token: string;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState<Category>("Electronics");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try {
      const payload: CreateProductRequest = {
        title,
        description: desc,
        category: cat,
        price: Number(price),
        imageUrl: imageUrl || "/placeholder.svg",
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create");
      onDone();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as Category)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <Textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <Input
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={submit}
      >
        Submit Listing
      </Button>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <a
      href={`/product/${p.id}`}
      className="group relative rounded-3xl overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 active:scale-95"
    >
      {/* Animated Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="aspect-[4/3] bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 overflow-hidden relative">
        <img
          src={p.imageUrl || "/placeholder.svg"}
          alt={p.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500/90 to-purple-500/90 backdrop-blur-md px-3 py-2 rounded-2xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {p.category}
        </div>
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md px-3 py-2 rounded-2xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          ✨ Featured
        </div>
      </div>
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-black text-white/90 truncate text-xl group-hover:text-white transition-colors duration-300">{p.title}</h3>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
            <span className="relative font-black text-2xl text-emerald-400 ml-2 group-hover:text-emerald-300 transition-colors duration-300">
              ₹{p.price.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-cyan-300 font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-cyan-400/30">
            {p.category}
          </span>
          <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors duration-300">
            <span className="text-sm font-bold">View Details</span>
            <span className="ml-2 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function AIAdvisor() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Electronics");
  const [price, setPrice] = useState<number>(100);
  const [quality, setQuality] = useState<number>(0.7);
  const [resp, setResp] = useState<AIPriceSuggestResponse | null>(null);

  const disabled = useMemo(() => !title || !price, [title, price]);

  const run = async () => {
    const res = await fetch("/api/ai/price-suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, listedPrice: price, quality }),
    });
    setResp((await res.json()) as AIPriceSuggestResponse);
  };

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6">
      <h2 className="text-lg font-bold text-emerald-900">
        AI Price & Impact Advisor
      </h2>
      <p className="text-sm text-emerald-900/70 mb-4">
        Get a fair price and see your environmental savings.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Your listed price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="flex items-center gap-3">
          <label className="text-sm text-emerald-900/80">Quality</label>
          <input
            type="range"
            min={0.4}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-emerald-900/70">
            {Math.round(quality * 100)}%
          </span>
        </div>
      </div>
      <Button
        disabled={disabled}
        onClick={run}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
      >
        Suggest Fair Price
      </Button>
      {resp && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50">
            <p className="text-xs text-emerald-900/70">Suggested Price</p>
            <p className="text-2xl font-extrabold text-emerald-800">
              ₹{resp.fairPrice.toFixed(2)}
            </p>
            <p className="text-xs text-emerald-900/60">
              Market ~ ₹{resp.marketPrice}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50">
            <p className="text-xs text-emerald-900/70">Emissions Saved</p>
            <p className="text-2xl font-extrabold text-emerald-800">
              {resp.savings.carbonKg} kg CO₂
            </p>
            <p className="text-xs text-emerald-900/60">vs. market trip</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50">
            <p className="text-xs text-emerald-900/70">Time Saved</p>
            <p className="text-2xl font-extrabold text-emerald-800">
              {resp.savings.timeHours} hr
            </p>
            <p className="text-xs text-emerald-900/60">Avg. errand</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Leaderboards({ data }: { data: LeaderboardResponse | null }) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6">
      <h2 className="text-lg font-bold text-emerald-900">Leaderboards</h2>
      <p className="text-sm text-emerald-900/70 mb-4">
        Who leads the eco-trade?
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-emerald-800 mb-2">
            Top Eco-Sellers
          </h3>
          <ol className="space-y-1">
            {data?.topSellers?.length ? (
              data.topSellers.map((e, i) => (
                <li
                  key={e.userId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-emerald-900/80">
                    {i + 1}. {e.username}
                  </span>
                  <span className="font-semibold text-emerald-900">
                    {e.count}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-emerald-900/60 text-sm">No data yet.</p>
            )}
          </ol>
        </div>
        <div>
          <h3 className="font-semibold text-emerald-800 mb-2">
            Top Eco-Buyers
          </h3>
          <ol className="space-y-1">
            {data?.topBuyers?.length ? (
              data.topBuyers.map((e, i) => (
                <li
                  key={e.userId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-emerald-900/80">
                    {i + 1}. {e.username}
                  </span>
                  <span className="font-semibold text-emerald-900">
                    {e.count}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-emerald-900/60 text-sm">No data yet.</p>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}