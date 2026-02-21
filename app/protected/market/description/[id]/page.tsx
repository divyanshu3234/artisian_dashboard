"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../cartStore";
import { Product } from "../../products";

function DescriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/market?id=${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product (${res.status})`);
        const json = await res.json();
        // API returns { products: [...] } — grab the first match
        const found: Product | undefined = (json.products ?? []).find(
          (p: Product) => p.id === id
        );
        setProduct(found ?? null);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
        <div className="border-b px-6 py-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-square rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
              <div className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not found ──────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {error ? "Failed to load product" : "Product not found"}
          </p>
          {error && (
            <p className="text-sm text-neutral-400 mb-4">{error}</p>
          )}
          <button
            onClick={() => router.push("/protected/market")}
            className="text-amber-500 hover:text-amber-400"
          >
            ← Back to Market
          </button>
        </div>
      </div>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      add({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image_url ?? "",
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/protected/market/cart");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">

      {/* Breadcrumb / Back bar */}
      <div className="border-b px-6 py-4 text-sm flex items-center gap-2
        bg-white dark:bg-neutral-900
        border-neutral-200 dark:border-neutral-700 shadow-sm">
        <button
          onClick={() => router.push("/protected/market")}
          className="text-neutral-400 hover:text-amber-500 transition-colors"
        >
          ← Market
        </button>
        <span className="text-neutral-300 dark:text-neutral-600">/</span>
        <span className="text-neutral-900 dark:text-white font-medium truncate">
          {product.name}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md
            bg-neutral-100 dark:bg-neutral-800">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
                No image
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div>
            {/* Seller & type */}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-400">
                {product.sellers?.display_name}
                {product.sellers?.display_name && product.sellers?.location && " · "}
                {product.sellers?.location}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* AI Description */}
            {product.ai_description && (
              <div className="rounded-xl p-4 border mb-4
                bg-amber-50 dark:bg-amber-950/20
                border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  ✨ AI Description
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {product.ai_description}
                </p>
              </div>
            )}

            {/* Price Box */}
            <div className="flex items-end gap-3 rounded-xl p-4 border mb-4
              bg-white dark:bg-neutral-900
              border-neutral-200 dark:border-neutral-700 shadow-sm">
              <span className="text-3xl font-bold">
                ₹{Number(product.price).toLocaleString()}
              </span>
            </div>

            {/* Stock */}
            <p
              className={`text-sm mb-4 font-medium ${
                product.instock ? "text-green-500" : "text-red-400"
              }`}
            >
              {product.instock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>

            {/* Quantity Selector */}
            {product.instock && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Qty:
                </span>
                <div className="flex items-center gap-3 rounded-xl px-4 py-2 border
                  bg-white dark:bg-neutral-800
                  border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-neutral-600 dark:text-white text-lg w-5 text-center"
                  >
                    −
                  </button>
                  <span className="w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="text-neutral-600 dark:text-white text-lg w-5 text-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAdd}
                disabled={!product.instock}
                className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                  !product.instock
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : added
                    ? "bg-green-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-600"
                }`}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.instock}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                  product.instock
                    ? "bg-amber-500 hover:bg-amber-400 text-black"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
              <span>🛡️ Verified Artisan</span>
              <span>🚚 Free Shipping</span>
              <span>↩️ 7-Day Returns</span>
              <span>🌐 Vertex AI Translated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <DescriptionPage />;
}
