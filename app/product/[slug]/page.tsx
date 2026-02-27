export default function ProductPage({ params }: any) {
  const slug = params?.slug || "product";

  const formattedName = slug
    .replace("-", " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6">
      <h1 className="text-3xl font-serif mb-4 text-center">
        {formattedName}
      </h1>

      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm">
        <div className="w-full h-60 bg-[#E8D7D2] rounded-xl mb-6" />

        <p className="mb-6 text-center">
          Luxury minimal press-on nails.
        </p>

        <div className="flex flex-col gap-4">
          <a
  href="/get-fit"
  className="px-6 py-3 rounded-full bg-[#C8B1A6] text-white text-center"
>
  Get Your Fit
</a>

          <button className="px-6 py-3 rounded-full border border-[#C8B1A6] text-[#C8B1A6]">
            Import Size
          </button>
        </div>
      </div>
    </main>
  );
}