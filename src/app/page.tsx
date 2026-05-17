import Navbar from "@/components/Navbar";
import ScrollSequence from "@/components/ScrollSequence";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#0050FF] selection:text-white">
      <Navbar />
      
      {/* Hero Intro Section (Optional - can just start with the sequence) */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative z-10 bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#050815] via-[#050505] to-[#050505] opacity-50 pointer-events-none" />
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 z-10">
          The Sound of Silence.
        </h1>
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl text-center z-10">
          Scroll to explore the engineering behind the ultimate listening experience.
        </p>
        <div className="absolute bottom-10 animate-bounce text-white/50 z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Main Animation Sequence */}
      <ScrollSequence />

      {/* Footer / Outro Section */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] relative z-10 px-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 text-center">
          Experience the extraordinary.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-16">
          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-xl font-semibold text-white">40 Hours</h3>
            <p className="text-white/60">Battery life with active noise cancellation.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-xl font-semibold text-white">Multipoint</h3>
            <p className="text-white/60">Connect to two Bluetooth devices simultaneously.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <h3 className="text-xl font-semibold text-white">Speak-to-Chat</h3>
            <p className="text-white/60">Music pauses automatically when you speak.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
