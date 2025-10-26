"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <HeroUIProvider>
        <ToastProvider placement="top-center"></ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
  );
}
