"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function ThemeSync({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    const themeName = resolvedTheme === "dark" ? "servicehub-dark" : "servicehub";
    root.setAttribute("data-theme", themeName);
  }, [resolvedTheme]);

  return <>{children}</>;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  );
}
