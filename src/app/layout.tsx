import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Review QR Card Generator | Print-Ready Cards",
  description: "Generate professional, print-ready Google Review QR cards for PVC cards, acrylic table standees, and cashier stickers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-canvas text-primary">
        {children}
      </body>
    </html>
  );
}
