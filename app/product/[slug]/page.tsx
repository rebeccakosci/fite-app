"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Category = "Press-On Nails" | "Care & Essentials";

type Product = {
  name: string;
  price: string;
  category: Category;
  description?: string;
};

type AccountRecord = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nailSizes: number[];
  nailWidths: number[];
};

const CARE_PRODUCTS_BY_SLUG: Record<string, Product> = {
  "long-lasting-nail-glue": {
    name: "Long Lasting Nail Glue",
    price: "$9",
    category: "Care & Essentials",
    description: "Salon-grade brush-on glue for secure, long-lasting wear.",
  },
  "on-the-go-long-lasting-nail-glue": {
    name: "On-the-Go Long Lasting Nail Glue",
    price: "$3",
    category: "Care & Essentials",
    description: "Travel-size glue pen for quick touch-ups away from home.",
  },
  "cuticle-oil": {
    name: "Cuticle Oil",
    price: "$14",
    category: "Care & Essentials",
    description: "Hydrating cuticle treatment with a lightweight, non-greasy finish.",
  },
  "purse-cuticle-oil": {
    name: "Purse Cuticle Oil",
    price: "$5",
    category: "Care & Essentials",
    description: "Mini cuticle oil tube that fits in your everyday bag.",
  },
  "prep-clean-kit": {
    name: "Prep + Clean Kit",
    price: "$12",
    category: "Care & Essentials",
    description: "Nail prep essentials to cleanse, dehydrate, and improve adhesion.",
  },
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [added, setAdded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(
    typeof window !== "undefined" ? sessionStorage.getItem("currentUserEmail") || "" : ""
  );

  const slug = params?.slug || "product";

  const fallbackName = useMemo(
    () => slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    [slug]
  );

  const product = useMemo(() => {
    if (typeof window === "undefined") return null;

    const storedDetail = sessionStorage.getItem("selectedProductDetail");
    if (storedDetail) {
      const parsed = JSON.parse(storedDetail) as Product;
      if (slugify(parsed.name) === slug) {
        return parsed;
      }
    }

    return CARE_PRODUCTS_BY_SLUG[slug] || null;
  }, [slug]);

  const currentProduct =
    product ||
    ({
      name: fallbackName,
      price: "$0",
      category: "Press-On Nails",
      description: "Luxury minimal press-on nails.",
    } as Product);

  const handleAddToCart = () => {
    const rawCart = sessionStorage.getItem("cartItems");
    const cartItems: Product[] = rawCart ? JSON.parse(rawCart) : [];
    cartItems.push(currentProduct);
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleLogin = () => {
    const normalizedEmail = loginEmail.trim().toLowerCase();
    const rawAccounts = sessionStorage.getItem("accounts");
    const accounts: AccountRecord[] = rawAccounts ? JSON.parse(rawAccounts) : [];
    const account = accounts.find(
      (item) => item.email === normalizedEmail && item.password === loginPassword
    );

    if (!account) {
      setLoginError("Invalid email or password.");
      return;
    }

    sessionStorage.setItem("currentUserEmail", account.email);
    sessionStorage.setItem("nailSizes", JSON.stringify(account.nailSizes));
    sessionStorage.setItem("nailWidths", JSON.stringify(account.nailWidths));

    setCurrentUserEmail(account.email);
    setShowLoginPrompt(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6">
      <h1 className="text-3xl font-serif mb-4 text-center">{currentProduct.name}</h1>

      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm">
        <div className="w-full h-60 bg-[#E8D7D2] rounded-xl mb-6" />

        <p className="text-sm text-gray-500 text-center mb-2">{currentProduct.price}</p>
        <p className="mb-6 text-center">
          {currentProduct.description || "Luxury minimal press-on nails."}
        </p>

        {currentProduct.category === "Care & Essentials" ? (
          <button
            onClick={handleAddToCart}
            className={`w-full px-6 py-3 rounded-full text-white text-center transition ${
              added ? "bg-[#7F9A7A]" : "bg-[#C8B1A6]"
            }`}
          >
            {added ? "Added" : "Add to Cart"}
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <Link href="/get-fit" className="px-6 py-3 rounded-full bg-[#C8B1A6] text-white text-center">
              Get Your Fit
            </Link>

            <button
              onClick={() => setShowLoginPrompt(true)}
              className="px-6 py-3 rounded-full border border-[#C8B1A6] text-[#C8B1A6]"
            >
              {currentUserEmail ? "Logged In" : "Log In"}
            </button>
          </div>
        )}
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-serif text-center mb-2">Returning Customer Log In</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Log in to restore your saved nail sizes.
            </p>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(event) => {
                setLoginEmail(event.target.value);
                setLoginError("");
              }}
              className="w-full mb-3 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => {
                setLoginPassword(event.target.value);
                setLoginError("");
              }}
              className="w-full mb-4 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
            />

            {loginError && (
              <p className="text-sm text-[#9A4A4A] mb-3 text-center">{loginError}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-full bg-[#C8B1A6] text-white mb-2"
            >
              Log In
            </button>

            <button
              onClick={() => {
                setShowLoginPrompt(false);
                setLoginError("");
              }}
              className="w-full py-3 rounded-full border border-[#C8B1A6] text-[#6E625C]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
