"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Toaster position="top-center" />
      <ToastProvider placement="top-center"></ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </HeroUIProvider>
  );
}
