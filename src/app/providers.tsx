"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-center"></ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
