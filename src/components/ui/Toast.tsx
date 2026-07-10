import * as React from "react";

export function Toast({ message }: { message: string }) {
  return (
    <div className="toast toast-end">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
}
