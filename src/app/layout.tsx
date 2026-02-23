import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rapid Role | Next-Gen iGaming",
  description: "Next-generation iGaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full min-h-screen bg-[#070707]`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
