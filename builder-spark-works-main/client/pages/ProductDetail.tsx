import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Calendar, 
  User, 
  Shield, 
  Truck, 
  RotateCcw,
  MessageCircle,
  Phone
} from "lucide-react";
import type { Product, User } from "@shared/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const productData = await response.json();
        setProduct(productData);
        
        // Fetch seller information
        const sellerResponse = await fetch(`/api/users/${productData.ownerId}`);
        if (sellerResponse.ok) {
          const sellerData = await sellerResponse.json();
          setSeller(sellerData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem("ecofinds_cart") || "[]");
    
    // Check if product is already in cart
    const existingItem = existingCart.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        productId: product.id,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem("ecofinds_cart", JSON.stringify(existingCart));
    setIsInCart(true);
    
    // Show success message (you could use a toast here)
    alert("Product added to cart!");
  };

  const handleContactSeller = () => {
    // In a real app, this would open a chat or contact form
    alert("Contact seller functionality would open here!");
  };

  if (loading) {
    return (
      <div className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-emerald-200 rounded-2xl"></div>
                <div className="flex gap-2">
                  <div className="h-20 bg-emerald-200 rounded-lg flex-1"></div>
                  <div className="h-20 bg-emerald-200 rounded-lg flex-1"></div>
                  <div className="h-20 bg-emerald-200 rounded-lg flex-1"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-emerald-200 rounded w-3/4"></div>
                <div className="h-6 bg-emerald-200 rounded w-1/2"></div>
                <div className="h-4 bg-emerald-200 rounded w-full"></div>
                <div className="h-4 bg-emerald-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/home")} className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const productAge = Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const isNew = productAge < 7;

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate("/home")}
            className="hover:text-emerald-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-emerald-600">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-emerald-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-emerald-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-emerald-100">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {product.category}
                </Badge>
                {isNew && (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    New
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {productAge} days ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-4xl font-black text-emerald-600">
                ₹{product.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Original price: <span className="line-through">₹{(product.price * 1.5).toLocaleString()}</span>
                <span className="text-emerald-600 font-semibold ml-2">33% OFF</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-900">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="ml-2 font-semibold text-emerald-700">Excellent</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <span className="ml-2 font-semibold text-emerald-700">{productAge} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Warranty:</span>
                    <span className="ml-2 font-semibold text-emerald-700">3 months</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Brand:</span>
                    <span className="ml-2 font-semibold text-emerald-700">Generic</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-emerald-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-emerald-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-emerald-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-emerald-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl"
                  disabled={isInCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-4 border-emerald-200 hover:bg-emerald-50"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 px-4 border-emerald-200 hover:bg-emerald-50"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Seller Information */}
            {seller && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {seller.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{seller.username}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>4.8</span>
                        <span>•</span>
                        <span>{seller.totalSold} items sold</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      <span>Verified Seller</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-600" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-emerald-600" />
                      <span>7-day Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      <span>Quick Response</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleContactSeller}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Seller
                    </Button>
                    <Button
                      variant="outline"
                      className="border-emerald-200 hover:bg-emerald-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with related products */}
            <div className="text-center py-8 text-gray-500">
              <p>Related products will be shown here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}