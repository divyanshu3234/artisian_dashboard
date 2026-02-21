"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: Omit<CartItem, "qty">) => {
    setItems((prev: CartItem[]) => {
      const found = prev.find((i: CartItem) => i.id === item.id);
      if (found) {
        return prev.map((i: CartItem) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const remove = (id: string) => {
    setItems((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  };

  const setQty = (id: string, qty: number) => {
    if (qty < 1) return remove(id);
    setItems((prev: CartItem[]) =>
      prev.map((i: CartItem) => (i.id === id ? { ...i, qty } : i))
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.qty,
    0
  );
  const count = items.reduce((sum: number, i: CartItem) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartStore {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
