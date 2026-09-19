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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700;900&family=Google+Sans+Text:wght@400;500;700&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen bg-canvas text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
