"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "../cartStore";
import { createClient } from "@/lib/supabase/client";

function CartPage() {
  const router = useRouter();
  const { items, remove, setQty, total, clear } = useCart();
  const [step, setStep] = useState<"cart" | "address" | "payment" | "done">("cart");
  const [seller, setSeller] = useState<any>(null);

  const supabase = createClient();

  // 🔥 Fetch seller info when address step opens
  useEffect(() => {
    if (step !== "address") return;

    const fetchSeller = async () => {
      const { data, error } = await supabase
        .from("sellers")
        .select(`
          first_name,
          last_name,
          street_address,
          city,
          pin_code,
          phone_number
        `)
        .single();

      // console.log("SELLER DATA:", data);
      // console.log("SELLER ERROR:", error);

      if (!error && data) {
        setSeller(data);
      }
    };

    fetchSeller();
  }, [step]);

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Order Placed!
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Thank you for supporting global artisans.
          </p>
          <button
            onClick={() => {
              clear();
              router.push("/protected/market");
            }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center gap-4
        bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
        <button
          onClick={() => router.push("/protected/market")}
          className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
        >
          ← Market
        </button>
        <h1 className="font-bold text-lg">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 px-6 py-4 border-b text-sm
        bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        {(["cart", "address", "payment"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s
                  ? "bg-amber-500 text-black"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={
                step === s
                  ? "text-neutral-900 dark:text-white font-medium"
                  : "text-neutral-400"
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && (
              <span className="text-neutral-300 dark:text-neutral-600 ml-1">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* Step 1 – Cart */}
          {step === "cart" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Your Items</h2>
              {items.length === 0 ? (
                <div className="text-center py-16 text-neutral-400">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="mb-3">Cart is empty.</p>
                  <button
                    onClick={() => router.push("/protected/market")}
                    className="text-amber-500 hover:text-amber-400"
                  >
                    Browse products →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl p-4 border
                        bg-white dark:bg-neutral-900
                        border-neutral-200 dark:border-neutral-700 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm
                            bg-neutral-100 dark:bg-neutral-800">
                            <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                            <span className="w-4 text-center">{item.qty}</span>
                            <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-600 font-bold">
                              ₹{(item.price * item.qty).toLocaleString()}
                            </span>
                            <button
                              onClick={() => remove(item.id)}
                              className="text-neutral-300 hover:text-red-400 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setStep("address")}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 – Address */}
          {step === "address" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Delivery Address</h2>
              <div className="rounded-xl p-5 space-y-4 border shadow-sm
                bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" defaultValue={seller?.first_name} />
                  <Field label="Last Name" defaultValue={seller?.last_name} />
                </div>
                <Field label="Street Address" defaultValue={seller?.street_address} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" defaultValue={seller?.city} />
                  <Field label="PIN Code" defaultValue={seller?.pin_code} />
                </div>
                <Field label="Phone Number" type="tel" defaultValue={seller?.phone_number} />
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 3 – Payment */}
          {step === "payment" && (
            <div>
              <h2 className="font-bold text-lg mb-4">Payment</h2>
              <div className="rounded-xl p-5 space-y-4 border shadow-sm
                bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-2 gap-3">
                  {["💳 Card", "📱 UPI", "🏦 Netbanking", "💰 Wallet"].map((m: string) => (
                    <button
                      key={m}
                      className="bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-xl py-2.5 text-sm text-white transition-colors"
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <Field label="Card Number" placeholder="1234 5678 9012 3456" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" placeholder="MM/YY" />
                  <Field label="CVV" placeholder="•••" />
                </div>
              </div>
              <button
                onClick={() => setStep("done")}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors"
              >
                🔒 Pay ₹{total.toLocaleString()}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-xl p-5 sticky top-6 border shadow-sm
            bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} ×{item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-amber-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder = "",
  defaultValue = "",
}: {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 border
          bg-neutral-50 dark:bg-neutral-800
          border-neutral-200 dark:border-neutral-600
          text-neutral-900 dark:text-white
          placeholder-neutral-300 dark:placeholder-neutral-600"
      />
    </div>
  );
}

export default function Page() {
  return <CartPage />;
}