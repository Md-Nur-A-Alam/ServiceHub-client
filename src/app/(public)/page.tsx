"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Home() {
  useEffect(() => {
    // Run health check on mount
    apiClient.get("/health")
      .then((response) => {
        console.log("[Health Check Status]:", response.data);
      })
      .catch((error) => {
        console.error("[Health Check Error]:", error);
      });
  }, []);

  return (
    <main className="p-sm md:p-lg max-w-(--container-max) mx-auto w-full space-y-md">
      {/* Header section with Theme Toggle */}
      <header className="flex items-center justify-between border-b border-outline-variant pb-xs">
        <div>
          <h1 className="text-h2 md:text-h1 text-primary">ServiceHub</h1>
          <p className="text-body text-on-surface-variant">Design Token Foundation Verification Playground</p>
        </div>
        <div className="flex items-center gap-xs">
          <span className="text-small text-on-surface-variant">Switch Theme:</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Renders our beautiful token showcase */}
      <section className="bg-surface-container p-sm md:p-md rounded-xl space-y-sm border border-outline-variant">
        <h2 className="text-h3 text-on-surface">Verification Details</h2>
        <p className="text-body text-on-surface-variant">
          This client has been successfully migrated to the <code className="font-mono bg-surface-container-high px-1 rounded text-small">src/</code> folder structure. It contains:
        </p>
        <ul className="list-disc pl-sm space-y-2 text-body">
          <li>Tailwind CSS v4 & DaisyUI v5 CSS custom properties & utility mapping</li>
          <li>QueryClient & query client provider registration in layout</li>
          <li>API health-check query executing on page mount (check developer console!)</li>
        </ul>
      </section>
    </main>
  );
}
