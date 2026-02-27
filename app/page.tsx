export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2B2B2B]">
      
      <h1 className="text-5xl font-serif mb-4">
        Fité
      </h1>

      <p className="text-lg mb-8">
        Find your fit in seconds.
      </p>

      <a
  href="/shop"
  className="px-6 py-3 rounded-full bg-[#C8B1A6] text-white"
>
  Shop Nails
</a>

    </main>
  )
}