"use client";

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToasts, dismiss } from "@/hooks/use-toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant}>
          <div className="grid gap-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose onClick={() => dismiss(t.id)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}