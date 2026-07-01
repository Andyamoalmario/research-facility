import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base di Ricerca",
  description: "Gestionale di una base di ricerca scientifica segreta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
