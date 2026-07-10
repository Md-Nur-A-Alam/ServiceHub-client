import * as React from "react";

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="alert alert-error">
      <span>{error}</span>
    </div>
  );
}
