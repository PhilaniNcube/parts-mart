import { atom } from "nanostores";
import { useSyncExternalStore } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const toastStore = atom<ToastItem[]>([]);

function emit() {
  // nanostores doesn't expose a public listeners count; we re-set the atom
  // (with a new array reference) so subscribers using useSyncExternalStore
  // pick up the change. Each mutation below already calls toastStore.set.
  return toastStore.get();
}

function subscribe(cb: () => void) {
  return toastStore.listen(cb);
}

function push(item: Omit<ToastItem, "id">) {
  const id = Math.random().toString(36).slice(2);
  const duration = item.duration ?? 4000;
  toastStore.set([...toastStore.get(), { ...item, id }]);
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

export function dismiss(id: string) {
  toastStore.set(toastStore.get().filter((t) => t.id !== id));
}

export const toast = Object.assign((item: Omit<ToastItem, "id">) => push(item), {
  success: (title: string, description?: string) => push({ title, description, variant: "success" }),
  error: (title: string, description?: string) => push({ title, description, variant: "destructive" }),
  dismiss,
});

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(subscribe, emit, emit);
}

export { toastStore };