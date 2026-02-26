import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center flex-1 text-center w-full">
      <div className="absolute top-0 left-0 md:-left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 md:-right-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="flex flex-col items-center justify-center flex-1 max-w-3xl space-y-8 z-10 px-4 w-full mt-10 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm leading-[1.2]">
          Manage Your <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Inventory Smarter
          </span>
        </h1>

        <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto leading-relaxed font-light">
          Streamline your warehouse operations with precision. Track stocks,
          manage categories, and monitor every movement in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 px-7 py-5 text-sm rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.15)] border border-blue-500/50 font-medium"
          >
            <Link href="/inventories">Get Started</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-gray-800 bg-gray-900/30 hover:bg-gray-800/80 px-7 py-5 text-sm rounded-full text-gray-300 backdrop-blur-sm font-medium transition-all"
          >
            <Link href="/stock-histories">View History</Link>
          </Button>
        </div>
      </div>

      <div className="mt-auto pt-16 pb-8 w-full">
        <div className="flex flex-row justify-between items-center border-t border-gray-800/30 pt-8 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start text-left">
            <p className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-1">
              Fast
            </p>
            <p className="text-xs text-gray-500/80 font-light">
              Real-time Updates
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-1">
              Secure
            </p>
            <p className="text-xs text-gray-500/80 font-light">
              Role-based Access
            </p>
          </div>

          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-1">
              Clean
            </p>
            <p className="text-xs text-gray-500/80 font-light">
              Modern Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
