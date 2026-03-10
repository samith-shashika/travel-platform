import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop"
          alt="hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main hero */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 pt-24 pb-16 max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">
              Discover the World
            </p>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6">
              Explore the<br />
              <span className="text-amber-400">Unseen</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Discover unique places beyond the tourist path, with carefully planned
              experiences that balance adventure, comfort, and authenticity.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <Link
                href="/feed"
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 px-6 py-4 rounded-2xl text-sm font-medium hover:bg-white/20 transition-colors text-center"
              >
                🔍 Search experiences, destinations...
              </Link>
              <Link
                href="/feed"
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-2xl transition-colors text-sm whitespace-nowrap"
              >
                Explore Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Experiences" },
              { value: "80+", label: "Destinations" },
              { value: "2k+", label: "Travelers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-amber-400">{stat.value}</p>
                <p className="text-white/60 text-xs md:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
