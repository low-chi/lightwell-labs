import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lightwell Labs, LLC",
  description: "Strategic clarity that unlocks momentum — now.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
