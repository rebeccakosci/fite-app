export default function Shop() {
  const products = [
    { name: "Milky Pink", price: "$28" },
    { name: "Soft Nude", price: "$28" },
    { name: "Sheer Rosé", price: "$28" },
    { name: "Glazed Neutral", price: "$32" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6">
      
      <h1 className="text-3xl mb-6 text-center font-serif">
        Shop Nails
      </h1>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center"
          >
            <div className="w-full h-40 bg-[#E8D7D2] rounded-xl mb-4" />

            <h2 className="text-lg mb-1">{product.name}</h2>
            <p className="text-sm mb-3">{product.price}</p>

            <a
  href={`/product/${product.name.toLowerCase().replace(" ", "-")}`}
  className="px-4 py-2 rounded-full bg-[#C8B1A6] text-white text-sm"
>
  View
</a>
          </div>
        ))}
      </div>

    </main>
  );
}