import * as React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-(--container-max) mx-auto px-gutter w-full">{children}</div>;
}
