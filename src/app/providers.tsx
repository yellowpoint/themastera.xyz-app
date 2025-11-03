"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCreatorPath = pathname?.startsWith("/creator") ?? false;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme={isCreatorPath ? "light" : "dark"}
      enableSystem={false}
    >
      <AuthProvider>
        <Toaster position="top-center" />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
