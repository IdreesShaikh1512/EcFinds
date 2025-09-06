import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Home, 
  Shirt, 
  Sofa, 
  BookOpen, 
  Dumbbell, 
  Sparkles, 
  ShoppingCart, 
  Car, 
  Heart, 
  Gamepad2, 
  Briefcase, 
  Gem, 
  TreePine,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "@shared/api";

const categoryConfig = [
  { 
    name: "Electronics", 
    description: "Phones, laptops, gadgets, and tech accessories", 
    icon: Smartphone, 
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    textColor: "text-blue-700"
  },
  { 
    name: "Home Appliances", 
    description: "Kitchen, cleaning, and home utilities", 
    icon: Home, 
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    textColor: "text-green-700"
  },
  { 
    name: "Clothing & Fashion", 
    description: "Men's, women's, and kids' clothing", 
    icon: Shirt, 
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    textColor: "text-pink-700"
  },
  { 
    name: "Furniture & Decor", 
    description: "Beds, sofas, chairs, and home decor", 
    icon: Sofa, 
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    textColor: "text-amber-700"
  },
  { 
    name: "Books & Media", 
    description: "Fiction, non-fiction, and study materials", 
    icon: BookOpen, 
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    textColor: "text-purple-700"
  },
  { 
    name: "Sports & Fitness", 
    description: "Gym equipment, outdoor gear, and accessories", 
    icon: Dumbbell, 
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    textColor: "text-orange-700"
  },
  { 
    name: "Beauty & Personal Care", 
    description: "Cosmetics, skincare, and personal hygiene", 
    icon: Sparkles, 
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
    textColor: "text-rose-700"
  },
  { 
    name: "Groceries & Food", 
    description: "Daily essentials, food, and beverages", 
    icon: ShoppingCart, 
    color: "bg-lime-50 border-lime-200 hover:bg-lime-100",
    textColor: "text-lime-700"
  },
  { 
    name: "Automotive", 
    description: "Car parts, accessories, and maintenance", 
    icon: Car, 
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    textColor: "text-gray-700"
  },
  { 
    name: "Health & Wellness", 
    description: "Medical supplies, supplements, and wellness", 
    icon: Heart, 
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    textColor: "text-red-700"
  },
  { 
    name: "Toys & Games", 
    description: "Children's toys, board games, and puzzles", 
    icon: Gamepad2, 
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    textColor: "text-yellow-700"
  },
  { 
    name: "Office & Stationery", 
    description: "Office supplies, stationery, and work essentials", 
    icon: Briefcase, 
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    textColor: "text-indigo-700"
  },
  { 
    name: "Jewelry & Accessories", 
    description: "Watches, jewelry, and fashion accessories", 
    icon: Gem, 
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    textColor: "text-violet-700"
  },
  { 
    name: "Garden & Outdoor", 
    description: "Plants, gardening tools, and outdoor equipment", 
    icon: TreePine, 
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    textColor: "text-emerald-700"
  },
  { 
    name: "Other", 
    description: "Miscellaneous items and unique finds", 
    icon: MoreHorizontal, 
    color: "bg-slate-50 border-slate-200 hover:bg-slate-100",
    textColor: "text-slate-700"
  },
];

export default function ProductCategories() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        
        // Calculate counts for each category
        const counts: Record<string, number> = {};
        data.forEach((product: Product) => {
          counts[product.category] = (counts[product.category] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to the main page with category filter
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Product Categories</h2>
        <p className="text-gray-600">Browse products by category to find exactly what you're looking for</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryConfig.map((cat) => {
          const IconComponent = cat.icon;
          const count = categoryCounts[cat.name] || 0;
          return (
            <Card
              key={cat.name}
              className={`${cat.color} transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 border-2 rounded-xl group`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${cat.color.replace('50', '100')}`}>
                    <IconComponent className={`w-6 h-6 ${cat.textColor}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {count} items
                  </Badge>
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${cat.textColor}`}>
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {cat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
