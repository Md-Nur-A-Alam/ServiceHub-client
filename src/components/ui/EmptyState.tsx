import * as React from "react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center p-md border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
      <p>{message}</p>
    </div>
  );
}
