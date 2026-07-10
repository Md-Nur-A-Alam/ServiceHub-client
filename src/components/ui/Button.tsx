import * as React from "react";

export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn btn-primary">{children}</button>;
}
