import type { Metadata } from "next";
import { manrope, inter } from "@/lib/fonts";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { QueryProvider } from "@/lib/query-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceHub — Local Service Booking Marketplace",
  description: "Discover and book trusted local service providers in your area. Home cleaning, plumbing, electrical, painting, and more.",
  keywords: ["local services", "home services", "service booking", "home cleaning", "plumbing", "electrician"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <QueryProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
