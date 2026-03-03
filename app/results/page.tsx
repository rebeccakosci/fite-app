"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AccountRecord = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nailSizes: number[];
  nailWidths: number[];
};

const fingers = [
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Pinky",
  "Right Thumb",
  "Right Index",
  "Right Middle",
  "Right Ring",
  "Right Pinky",
];
const getPressOnSize = (mm: number) => {
  const chart = [
    { size: 0, mm: 18 },
    { size: 1, mm: 17 },
    { size: 2, mm: 16 },
    { size: 3, mm: 15 },
    { size: 4, mm: 14 },
    { size: 5, mm: 13 },
    { size: 6, mm: 12 },
    { size: 7, mm: 11 },
    { size: 8, mm: 10 },
    { size: 9, mm: 9 },
  ];

  let closest = chart[0];

  for (const item of chart) {
    if (Math.abs(item.mm - mm) < Math.abs(closest.mm - mm)) {
      closest = item;
    }
  }

  return closest.size;
};

export default function Results() {
  const router = useRouter();
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [showGluePrompt, setShowGluePrompt] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountError, setAccountError] = useState("");

  const widths = useMemo(() => {
    if (typeof window === "undefined") return [];
    const storedWidths = sessionStorage.getItem("nailWidths");
    return storedWidths ? (JSON.parse(storedWidths) as number[]) : [];
  }, []);

  const product = useMemo(() => {
    if (typeof window === "undefined") return null;
    const storedProduct = sessionStorage.getItem("selectedProduct");
    if (!storedProduct) return null;
    return JSON.parse(storedProduct) as {
      name: string;
      price: string;
      category?: string;
      collection?: string;
    };
  }, []);

 const sizes = widths.map((w) => getPressOnSize(w));

const addSizedSetToBasket = () => {
  if (!product) return;

  const rawCart = sessionStorage.getItem("cartItems");
  const cartItems: Array<{
    name: string;
    price: string;
    category?: string;
    collection?: string;
    selectedSizes?: number[];
  }> = rawCart ? JSON.parse(rawCart) : [];

  const alreadyInBasket = cartItems.some(
    (item) =>
      item.name === product.name &&
      JSON.stringify(item.selectedSizes || []) === JSON.stringify(sizes)
  );

  if (!alreadyInBasket) {
    cartItems.push({
      ...product,
      selectedSizes: sizes,
    });
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
};

const handleSignup = () => {
  setShowAccountPrompt(true);
};

const handleCreateAccount = () => {
  if (!firstName.trim() || !lastName.trim()) {
    setAccountError("Enter your first and last name.");
    return false;
  }

  if (!email.includes("@")) {
    setAccountError("Enter a valid email.");
    return false;
  }

  if (password.length < 4) {
    setAccountError("Password must be at least 4 characters.");
    return false;
  }

  if (password !== confirmPassword) {
    setAccountError("Passwords do not match.");
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();

  sessionStorage.setItem("nailSizes", JSON.stringify(sizes));
  sessionStorage.setItem(
    "accountProfile",
    JSON.stringify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
    })
  );
  sessionStorage.setItem("currentUserEmail", normalizedEmail);

  const rawAccounts = sessionStorage.getItem("accounts");
  const accounts: AccountRecord[] = rawAccounts ? JSON.parse(rawAccounts) : [];
  const updatedAccount: AccountRecord = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password,
    nailSizes: sizes,
    nailWidths: widths,
  };

  const existingIndex = accounts.findIndex((account) => account.email === normalizedEmail);
  if (existingIndex >= 0) {
    accounts[existingIndex] = updatedAccount;
  } else {
    accounts.push(updatedAccount);
  }
  sessionStorage.setItem("accounts", JSON.stringify(accounts));

  addSizedSetToBasket();
  return true;
};

const handleCreateAccountAndKeepShopping = () => {
  if (!handleCreateAccount()) return;
  router.push("/shop");
};

const handleCreateAccountAndCheckout = () => {
  if (!handleCreateAccount()) return;
  setShowAccountPrompt(false);
  setShowGluePrompt(true);
};

const handleGuest = () => {
  sessionStorage.setItem("nailSizes", JSON.stringify(sizes));
  addSizedSetToBasket();
  setShowGluePrompt(true);
};

const addGlueToBasket = () => {
  const rawCart = sessionStorage.getItem("cartItems");
  const cartItems: Array<{ name: string; price: string; category?: string }> = rawCart
    ? JSON.parse(rawCart)
    : [];

  const glueName = "Long Lasting Nail Glue";
  const hasGlue = cartItems.some((item) => item.name === glueName);

  if (!hasGlue) {
    cartItems.push({
      name: glueName,
      price: "$9",
      category: "Care & Essentials",
    });
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
};

const handleAddGlueAndCheckout = () => {
  addGlueToBasket();
  router.push("/checkout");
};

const handleCheckoutWithoutGlue = () => {
  router.push("/checkout");
};

return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center">

     <h1 className="text-3xl font-serif mb-4 text-center">
  Your Nail Measurements
</h1>

{product && (
  <div className="bg-white rounded-2xl p-4 shadow mb-6 text-center w-full max-w-md">
    <div className="w-full h-32 bg-[#E8D7D2] rounded-xl mb-3" />
    <p className="font-medium text-lg">{product.name}</p>
    <p className="text-sm text-gray-500">{product.price}</p>
  </div>
)}


      <div className="w-full max-w-md bg-white rounded-2xl shadow p-4">

        {widths.length === 0 && (
          <p className="text-center text-gray-500">
            No measurements found.
          </p>
        )}

        {widths.map((width, index) => (
          <div
            key={index}
            className="flex justify-between py-2 border-b"
          >
            <span>{fingers[index]}</span>
            <span className="font-medium">
              Size {getPressOnSize(width)}
            </span>
          </div>
        ))}

      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
  Your custom sizes are ready ✨
</p>

      <div className="flex flex-col gap-3 mt-6 w-full max-w-md">

  <button
    onClick={handleSignup}
    className="px-8 py-3 rounded-full bg-[#C8B1A6] text-white text-lg font-medium shadow"
  >
    Create Account
  </button>

  <button
    onClick={handleGuest}
    className="px-8 py-3 rounded-full border border-[#C8B1A6] text-[#6E625C] text-lg font-medium"
  >
    Continue as Guest
  </button>

  <p className="text-xs text-gray-500 text-center">
    You can save your sizes later
  </p>

</div>

{showAccountPrompt && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-2xl font-serif text-center mb-2">
        Create Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-5">
        We saved your nail set in your basket. Create an account and keep shopping.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setAccountError("");
          }}
          className="w-full px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setAccountError("");
          }}
          className="w-full px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setAccountError("");
        }}
        className="w-full mb-3 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setAccountError("");
        }}
        className="w-full mb-4 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
      />

      <input
        type="password"
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setAccountError("");
        }}
        className="w-full mb-4 px-4 py-3 rounded-xl border border-[#E5D6CF] focus:outline-none"
      />

      {accountError && (
        <p className="text-sm text-[#9A4A4A] mb-3 text-center">{accountError}</p>
      )}

      <button
        onClick={handleCreateAccountAndKeepShopping}
        className="w-full py-3 rounded-full bg-[#C8B1A6] text-white mb-2"
      >
        Create Account & Keep Shopping
      </button>

      <button
        onClick={handleCreateAccountAndCheckout}
        className="w-full py-3 rounded-full border border-[#C8B1A6] text-[#6E625C] mb-2"
      >
        Create Account & Checkout
      </button>

      <button
        onClick={() => setShowAccountPrompt(false)}
        className="w-full py-3 rounded-full border border-[#C8B1A6] text-[#6E625C]"
      >
        Not now
      </button>
    </div>
  </div>
)}

{showGluePrompt && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-2xl font-serif text-center mb-2">
        Don&apos;t Forget The Glue
      </h2>

      <div className="w-full h-40 bg-[#E8D7D2] rounded-xl mb-3 flex items-end justify-center">
        <p className="text-xs text-[#6E625C] bg-white/70 px-3 py-1 rounded-full mb-3">
          Long Lasting Nail Glue
        </p>
      </div>

      <p className="text-sm text-gray-500 text-center mb-5">
        Glue is not included with your nail set. Add glue now so your set is ready to wear.
      </p>

      <button
        onClick={handleAddGlueAndCheckout}
        className="w-full py-3 rounded-full bg-[#C8B1A6] text-white mb-2"
      >
        Add Glue & Checkout
      </button>

      <button
        onClick={handleCheckoutWithoutGlue}
        className="w-full py-3 rounded-full border border-[#C8B1A6] text-[#6E625C] mb-2"
      >
        Checkout Without Glue
      </button>

      <button
        onClick={() => {
          setShowGluePrompt(false);
          setShowAccountPrompt(true);
        }}
        className="w-full py-3 rounded-full border border-[#C8B1A6] text-[#6E625C]"
      >
        Back
      </button>
    </div>
  </div>
)}

    </main>
  );
};
