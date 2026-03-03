"use client";

import { useState } from "react";

type CartItem = {
  name: string;
  price: string;
  category?: string;
  collection?: string;
  selectedSizes?: number[];
};

type GroupedCartItem = CartItem & {
  quantity: number;
};

export default function Checkout() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  let cartItems: CartItem[] = [];
  let sizes: number[] = [];

  if (typeof window !== "undefined") {
    const rawCart = sessionStorage.getItem("cartItems");
    const parsedCart = rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];

    if (parsedCart.length > 0) {
      cartItems = parsedCart;
    } else {
      // Backward-compatible fallback if cart is empty but single selected product exists.
      const storedProduct = sessionStorage.getItem("selectedProduct");
      if (storedProduct) {
        const storedSizes = sessionStorage.getItem("nailSizes");
        const fallbackSizes = storedSizes ? (JSON.parse(storedSizes) as number[]) : [];
        const fallbackProduct = JSON.parse(storedProduct) as CartItem;
        cartItems = [{ ...fallbackProduct, selectedSizes: fallbackSizes }];
      }
    }

    const storedSizes = sessionStorage.getItem("nailSizes");
    sizes = storedSizes ? (JSON.parse(storedSizes) as number[]) : [];
  }

  const grouped = new Map<string, GroupedCartItem>();
  cartItems.forEach((item) => {
    const sizeKey = JSON.stringify(item.selectedSizes || []);
    const key = `${item.name}|${item.price}|${sizeKey}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.quantity += 1;
    } else {
      grouped.set(key, { ...item, quantity: 1 });
    }
  });
  const groupedCartItems = Array.from(grouped.values());

  const parsePrice = (price: string) => Number(price.replace(/[^0-9.]/g, "")) || 0;
  const subtotal = groupedCartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert("Checkout coming soon ✨");
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center">

      <h1 className="text-3xl font-serif mb-6 text-center">
        Checkout
      </h1>

      <div className="bg-white rounded-2xl p-4 shadow mb-6 w-full max-w-md">
        <p className="font-medium mb-3">Order Review</p>

        {groupedCartItems.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {groupedCartItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity}
                      {item.category ? ` • ${item.category}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                {item.selectedSizes && item.selectedSizes.length > 0 && (
                  <p className="text-xs text-[#6E625C] mt-1">
                    Sizes: {item.selectedSizes.join(", ")}
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-between pt-1">
              <p className="font-medium">Subtotal</p>
              <p className="font-medium">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow mb-6 w-full max-w-md">
          <p className="font-medium mb-2">Your Sizes</p>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-full bg-[#F0E6E2] text-sm"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Info */}
      <div className="bg-white rounded-2xl p-4 shadow w-full max-w-md flex flex-col gap-3">

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded-lg p-3"
        />

      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 px-8 py-3 rounded-full bg-[#C8B1A6] text-white text-lg font-medium shadow"
      >
        Complete Order
      </button>

    </main>
  );
}
