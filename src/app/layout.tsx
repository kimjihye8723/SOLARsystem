import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "시설물 관리 시스템 (FMS)",
  description: "Next.js 기반 고성능 실시간 시설물 모니터링 및 자산 관리 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0b0d10] transition-colors duration-300">
            {/* Left LNB Sidebar */}
            <Sidebar />

            {/* Right content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top GNB Header */}
              <Header />

              {/* Main panel content */}
              <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0b0d10] transition-colors duration-300">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
