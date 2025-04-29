import { Particles } from "./ui/Particles";

export default function Hero() {
  return (
    <div className="relative overflow-hidden h-[800px] w-full bg-black">
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={80}
        color="#ffffff"
        refresh={false}
        size={0.5}
        staticity={50}
      />
      {/* Hero Content */}
      <div className="mt-60 relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hi, I&apos;m name
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-6">
          Front-End Developer passionate about building beautiful web
          experiences.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 hover:-translate-y-1">
            View Projects
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-1">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}
