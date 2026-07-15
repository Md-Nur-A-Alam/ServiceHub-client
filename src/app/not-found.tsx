"use client";

import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-background text-on-surface overflow-hidden">
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* Animated 404 Graphics */}
        <div className="relative h-48 sm:h-64 flex items-center justify-center">
          {mounted && (
            <>
              <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-20">
                <div className="w-64 h-64 bg-primary rounded-full blur-3xl filter mix-blend-multiply"></div>
                <div className="w-64 h-64 bg-error rounded-full blur-3xl filter mix-blend-multiply -ml-20 mt-10"></div>
              </div>
              <h1 className="text-[120px] sm:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-error font-display animate-in slide-in-from-bottom-10 fade-in duration-1000">
                404
              </h1>
            </>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150 fill-mode-both">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Oops! Page Not Found
          </h2>
          <p className="text-on-surface/60 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            The page you're looking for seems to have wandered off. It might have been moved, deleted, or perhaps it never existed at all.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300 fill-mode-both">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-bold hover:brightness-110 transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            <MoveLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-outline-variant hover:border-primary text-on-surface hover:text-primary font-bold transition-all active:scale-95 w-full sm:w-auto justify-center bg-surface"
          >
            <Search className="w-5 h-5" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
