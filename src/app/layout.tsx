import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.scss";

// This imports the Inter font from Google Fonts.
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse - Communicate, Anywhere, Anytime",
  description:
    "Connect effortlessly across all devices with Pulse. Break free from limitations and redefine communication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}