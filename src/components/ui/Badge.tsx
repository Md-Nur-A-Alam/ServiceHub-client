import * as React from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge badge-outline">{children}</span>;
}
