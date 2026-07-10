import * as React from "react";

export function Modal({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-md rounded-xl max-w-md w-full">{children}</div>
    </div>
  );
}
