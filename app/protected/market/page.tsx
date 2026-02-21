"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "./cartStore";
import { Product } from "./products";

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { items, remove, setQty, total, clear } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/protected/market/cart");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col shadow-2xl transition-transform duration-300
          bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-bold text-neutral-900 dark:text-white">
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <p className="text-center text-neutral-400 mt-20 text-sm">
              Your cart is empty
            </p>
          )}
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 flex items-center justify-center text-neutral-400 text-xs">
                  No img
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {item.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg px-2 py-1 text-sm">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="text-neutral-700 dark:text-white w-4 text-center"
                    >
                      −
                    </button>
                    <span className="text-neutral-900 dark:text-white w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="text-neutral-700 dark:text-white w-4 text-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-amber-600 font-semibold text-sm">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                className="text-neutral-300 hover:text-red-400 text-sm self-start pt-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex justify-between font-bold">
              <span className="text-neutral-900 dark:text-white">Total</span>
              <span className="text-amber-600">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={clear}
              className="block w-full text-center text-sm text-neutral-400 hover:text-red-400 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { add, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i: CartItem) => i.id === product.id);

  const goToProduct = () => {
    router.push(`/protected/market/description/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.instock) return;
    add({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url ?? "",
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.instock) return;
    add({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url ?? "",
    });
    router.push("/protected/market/cart");
  };

  return (
    <div
      onClick={goToProduct}
      className="cursor-pointer group rounded-2xl overflow-hidden border transition-all duration-300
        bg-white dark:bg-neutral-900
        border-neutral-200 dark:border-neutral-700
        hover:border-amber-400 dark:hover:border-amber-500
        hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600 text-sm">
            No image
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-900/60 text-white capitalize">
          {product.type}
        </span>
        {!product.instock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.sellers?.display_name && (
          <p className="text-xs text-neutral-400 mb-1 truncate">
            {product.sellers.display_name}
          </p>
        )}
        <h3 className="font-semibold text-sm mb-3 line-clamp-1 text-neutral-900 dark:text-white">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-neutral-900 dark:text-white">
            ₹{Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.instock}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-colors ${
              !product.instock
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                : justAdded || inCart
                ? "bg-green-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-600"
            }`}
          >
            {!product.instock
              ? "Unavailable"
              : justAdded
              ? "✓ Added"
              : inCart
              ? "In Cart"
              : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!product.instock}
            className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${
              product.instock
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 animate-pulse">
      <div className="aspect-square bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mt-2" />
        <div className="flex gap-2 mt-3">
          <div className="flex-1 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="flex-1 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Market Page ─────────────────────────────────────────────────────────

function MarketContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { count } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/market");
        if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
        const json = await res.json();
        setProducts(json.products ?? []);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">

      {/* Navbar */}
      <div className="sticky top-0 z-30 backdrop-blur border-b px-6 py-4 flex items-center justify-between
        bg-white/90 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div></div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          🛒 Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Grid */}
      <div className="px-6 py-6">
        {error ? (
          <div className="text-center py-20 text-red-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-semibold mb-1">Could not load products</p>
            <p className="text-sm text-neutral-400">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-neutral-400 text-sm mb-4">
              {loading ? "Loading…" : `${products.length} items`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
            {!loading && products.length === 0 && (
              <div className="text-center py-20 text-neutral-400">
                <p className="text-4xl mb-3">🛍️</p>
                <p>No products available yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function Page() {
  return <MarketContent />;
}
