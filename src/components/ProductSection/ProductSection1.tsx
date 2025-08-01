"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Filter, ChevronDown, X, Search } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/Cart/CartProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useApiConfig } from "../../context/ApiConfigContext";
import { useAuth } from "../../context/AuthContext";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  category: string;
  sku?: string;
  costPrice?: string;
  regularPrice?: string;
  salePrice: string;
  stockStatus?: string;
  stockNumber?: string;
  showProduct?: boolean;
  hasExpirationDate?: boolean;
  expirationDate?: string | null;
  hasVariations?: boolean;
  variations?: unknown[];
  description?: string;
  images?: string[];
}

interface Category {
  _id: string;
  name: string;
  img?: string;
  banner?: string;
  show?: boolean;
}

export interface ProductSection1Props {
  categoryFilter?: string | null;
  allProductsRef?: React.RefObject<HTMLDivElement | null>;
}

function ProductSection1Inner({ categoryFilter, allProductsRef }: ProductSection1Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, buyNow } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showFilters, setShowFilters] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { apiBaseUrl } = useApiConfig();
  const { user } = useAuth();

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams?.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // Fetch products and categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const productUrl = searchQuery
          ? `${apiBaseUrl}products?q=${encodeURIComponent(
              searchQuery
            )}${user?._id ? `&userId=${user._id}` : ''}`
          : `${apiBaseUrl}products${user?._id ? `?userId=${user._id}` : ''}`;

        const categoryUrl = user?._id 
          ? `${apiBaseUrl}categories?userId=${user._id}`
          : `${apiBaseUrl}categories`;

        const [productRes, categoryRes] = await Promise.all([
          axios.get(productUrl),
          axios.get(categoryUrl),
        ]);

        console.log("Products fetched:", productRes.data);
        console.log("Categories fetched:", categoryRes.data);

        setProducts(productRes.data);
        setCategories(categoryRes.data);

        // Create category map
        const map: Record<string, string> = {};
        categoryRes.data.forEach((cat: Category) => {
          map[cat._id] = cat.name;
        });
        setCategoryMap(map);

        setFilteredProducts(productRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [apiBaseUrl, searchQuery, user?._id]);

  // Apply category filter from props
  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => {
        const productCategory = categoryMap[product.category];
        return productCategory === selectedCategory;
      });
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        parseFloat(product.salePrice) >= priceRange[0] &&
        parseFloat(product.salePrice) <= priceRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseFloat(a.salePrice) - parseFloat(b.salePrice);
        case "price-desc":
          return parseFloat(b.salePrice) - parseFloat(a.salePrice);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy, priceRange, categoryMap]);

  const handleQuickView = (productId: string) => {
    router.push(`/product?id=${productId}`);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleCategoryBannerClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" ref={allProductsRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium products
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={16} />
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setCategoryDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setCategoryDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">🛍️</div>
                  )}
                </div>
                
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                    {categoryMap[product.category] || 'Category'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.brand || 'brand'}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.salePrice)}
                    </span>
                    {product.regularPrice && parseFloat(product.regularPrice) > parseFloat(product.salePrice) && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={() => buyNow(product)}
                    className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${currentPage === page ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

const ProductSection1: React.FC<ProductSection1Props> = (props) => (
  <Suspense fallback={<div>Loading products...</div>}>
    <ProductSection1Inner {...props} />
  </Suspense>
);

export default ProductSection1;