import * as React from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="navbar bg-surface border-b border-outline-variant px-sm">
      <div className="flex-1">
        <span className="text-h3 font-bold text-primary">ServiceHub</span>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
      </div>
    </nav>
  );
}
