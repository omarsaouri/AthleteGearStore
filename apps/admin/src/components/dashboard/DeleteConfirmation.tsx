"use client";

import { AlertCircle, X } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80">
      <div className="bg-foreground rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-error">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-lg font-medium text-copy">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-copy-light" />
          </button>
        </div>

        <p className="text-copy-light mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-copy bg-background border border-border rounded-md hover:border-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-error-content bg-error rounded-md hover:bg-error/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
