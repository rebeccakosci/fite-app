export default function GetFit() {
  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center justify-center">
      
      <h1 className="text-3xl font-serif mb-4 text-center">
        Find Your Perfect Fit
      </h1>

      <p className="mb-8 text-center max-w-sm">
        We’ll scan each nail to match you with the best size from our collection.
        Place your QR card on a flat surface and follow the steps.
      </p>

      <a
        href="/scan"
        className="px-6 py-3 rounded-full bg-[#C8B1A6] text-white"
      >
        Start Scan
      </a>

    </main>
  );
}