"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = "View All" | "Press-On Nails" | "Care & Essentials";
type Collection = "All collections" | "Ballerina" | "Celeste";

type Product = {
  name: string;
  price: string;
  category: Exclude<Category, "View All">;
  collection?: Exclude<Collection, "All collections">;
  description?: string;
  selectedSizes?: number[];
};

type AccountRecord = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nailSizes: number[];
  nailWidths: number[];
};

export default function Shop() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>("View All");
  const [selectedCollection, setSelectedCollection] = useState<Collection>("All collections");
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(
    typeof window !== "undefined" ? sessionStorage.getItem("currentUserEmail") || "" : ""
  );

  const categories: Category[] = ["View All", "Press-On Nails", "Care & Essentials"];
  const collections: Collection[] = ["All collections", "Ballerina", "Celeste"];

  const products: Product[] = [
    { name: "Ballerina Pink", price: "$16", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Ballet Slipper", price: "$16", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Pointe Nude", price: "$16", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Studio Latte", price: "$16", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Bare Ballet", price: "$18", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Signature Pointe", price: "$18", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Grand Jeté", price: "$18", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Chassé", price: "$18", category: "Press-On Nails", collection: "Ballerina" },
    { name: "Midnight Spark", price: "$26", category: "Press-On Nails", collection: "Celeste" },
    { name: "Moonlit Velvet", price: "$26", category: "Press-On Nails", collection: "Celeste" },
    { name: "Celestial Dust", price: "$26", category: "Press-On Nails", collection: "Celeste" },
    { name: "Nebula Noir", price: "$26", category: "Press-On Nails", collection: "Celeste" },
    {
      name: "Long Lasting Nail Glue",
      price: "$9",
      category: "Care & Essentials",
      description: "Salon-grade brush-on glue for secure, long-lasting wear.",
    },
    {
      name: "On-the-Go Long Lasting Nail Glue",
      price: "$3",
      category: "Care & Essentials",
      description: "Travel-size glue pen for quick touch-ups away from home.",
    },
    {
      name: "Cuticle Oil",
      price: "$14",
      category: "Care & Essentials",
      description: "Hydrating cuticle treatment with a lightweight, non-greasy finish.",
    },
    {
      name: "Purse Cuticle Oil",
      price: "$5",
      category: "Care & Essentials",
      description: "Mini cuticle oil tube that fits in your everyday bag.",
    },
    {
      name: "Prep + Clean Kit",
      price: "$12",
      category: "Care & Essentials",
      description: "Nail prep essentials to cleanse, dehydrate, and improve adhesion.",
    },
  ];

  const categoryFilteredProducts =
    selectedCategory === "View All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const filteredProducts =
    selectedCategory === "Press-On Nails" && selectedCollection !== "All collections"
      ? categoryFilteredProducts.filter((product) => product.collection === selectedCollection)
      : categoryFilteredProducts;

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    if (category !== "Press-On Nails") {
      setSelectedCollection("All collections");
    }
  };

  const handleGetSized = (product: Product) => {
    // Save selected product
    sessionStorage.setItem("selectedProduct", JSON.stringify(product));

    if (currentUserEmail) {
      const rawAccounts = sessionStorage.getItem("accounts");
      const accounts: AccountRecord[] = rawAccounts ? JSON.parse(rawAccounts) : [];
      const account = accounts.find((item) => item.email === currentUserEmail);

      if (account && account.nailWidths.length > 0) {
        sessionStorage.setItem("nailWidths", JSON.stringify(account.nailWidths));
        sessionStorage.setItem("nailSizes", JSON.stringify(account.nailSizes));
        router.push("/results");
        return;
      }
    }

    // Go to scan when no saved account measurements exist
    router.push("/scan");
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleOpenProduct = (product: Product) => {
    sessionStorage.setItem("selectedProductDetail", JSON.stringify(product));
    router.push(`/product/${slugify(product.name)}`);
  };

  const handleAddToCart = (product: Product) => {
    const rawCart = sessionStorage.getItem("cartItems");
    const cartItems: Product[] = rawCart ? JSON.parse(rawCart) : [];

    const storedSizes = sessionStorage.getItem("nailSizes");
    const savedSizes = storedSizes ? (JSON.parse(storedSizes) as number[]) : [];
    const itemToAdd =
      product.category === "Press-On Nails" && savedSizes.length > 0
        ? { ...product, selectedSizes: savedSizes }
        : product;

    cartItems.push(itemToAdd);
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

    setRecentlyAdded((prev) => ({ ...prev, [product.name]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.name]: false }));
    }, 1200);
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
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-4 sm:p-6">

      <div className="mb-5 sm:mb-6 flex items-start justify-between gap-3">
        <h1 className="text-3xl font-serif mb-2">Shop</h1>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowLoginPrompt(true)}
            className="h-10 w-10 rounded-full bg-white text-[#4C4541] border border-[#E5D6CF] flex items-center justify-center"
            aria-label="Open account login"
            title={currentUserEmail ? "Account" : "Log in"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19.5c1.7-3 4.3-4.5 7-4.5s5.3 1.5 7 4.5" />
            </svg>
          </button>

          <button
            onClick={() => router.push("/checkout")}
            className="h-10 w-10 rounded-full bg-white text-[#4C4541] border border-[#E5D6CF] flex items-center justify-center"
            aria-label="Go to checkout"
            title="Checkout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 7h12l-1 12H7L6 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:w-56">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8A7D76] mb-3">
            Categories
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-left px-3 py-2 rounded-full md:rounded-lg text-sm whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-[#C8B1A6] text-white"
                    : "bg-white text-[#4C4541] hover:bg-[#EFE6E1]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedCategory === "Press-On Nails" && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8A7D76] mb-2">
                Collections
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible">
                {collections.map((collection) => (
                  <button
                    key={collection}
                    onClick={() => setSelectedCollection(collection)}
                    className={`text-left px-3 py-2 rounded-full md:rounded-lg text-sm whitespace-nowrap transition ${
                      selectedCollection === collection
                        ? "bg-[#E5D6CF] text-[#3E3733]"
                        : "bg-white text-[#4C4541] hover:bg-[#EFE6E1]"
                    }`}
                  >
                    {collection}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {filteredProducts.map((product, index) => (
            (() => {
              const useQuickAddOnly =
                product.category === "Care & Essentials" ||
                (product.category === "Press-On Nails" && Boolean(currentUserEmail));

              return (
            <div
              key={`${product.name}-${index}`}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center"
            >
              {useQuickAddOnly ? (
                <div className="relative w-full h-40 rounded-xl mb-4">
                  <button
                    onClick={() => handleOpenProduct(product)}
                    className="w-full h-full bg-[#E8D7D2] rounded-xl text-left"
                  >
                    <span className="sr-only">Open {product.name}</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center text-lg leading-none ${
                      recentlyAdded[product.name]
                        ? "bg-[#7F9A7A] text-white"
                        : "bg-white text-[#5B514C]"
                    }`}
                    aria-label={`Quick add ${product.name} to cart`}
                  >
                    {recentlyAdded[product.name] ? "✓" : "+"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenProduct(product)}
                  className="w-full h-40 bg-[#E8D7D2] rounded-xl mb-4"
                >
                  <span className="sr-only">Open {product.name}</span>
                </button>
              )}

              {useQuickAddOnly ? (
                <button
                  onClick={() => handleOpenProduct(product)}
                  className="text-lg mb-1 text-center hover:underline"
                >
                  {product.name}
                </button>
              ) : (
                <button
                  onClick={() => handleOpenProduct(product)}
                  className="text-lg mb-1 text-center hover:underline"
                >
                  {product.name}
                </button>
              )}
              <p className="text-sm mb-3">{product.price}</p>

              {product.category === "Press-On Nails" && !currentUserEmail && (
                <button
                  onClick={() => handleGetSized(product)}
                  className="px-4 py-2 rounded-full text-white text-sm transition bg-[#C8B1A6]"
                >
                  Get Sized
                </button>
              )}
            </div>
              );
            })()
          ))}
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-serif text-center mb-2">Account Login</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Returning shoppers can log in to reuse saved nail sizes.
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
