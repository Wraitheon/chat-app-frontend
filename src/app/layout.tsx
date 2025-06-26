import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.scss";
import QueryProvider from './components/providers/QueryProvider';
import { AuthProvider } from "./components/providers/AuthProvider";
import { righteous, roboto } from './fonts';
import { SocketProvider } from './components/providers/SocketProvider';

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
      <body className={`${inter.className} ${righteous.variable} ${roboto.variable} {
        constructor(parameters) {
          
        }
      }}`}>
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
              <div id="modal-root" />
            </SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}