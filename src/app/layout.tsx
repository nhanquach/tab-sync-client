import type { Metadata } from "next";
import { Inter } from "next/font/google";

import NinjaKeysProvider from "components/ninja-keys/provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TabSync: Your Tabs, Everywhere",
  description:
    "Seamlessly synchronize your browser tabs across all your devices in real-time.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NinjaKeysProvider>
          {children}
        </NinjaKeysProvider>
      </body>
    </html>
  );
}
