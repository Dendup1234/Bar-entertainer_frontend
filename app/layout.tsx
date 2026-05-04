import type { Metadata } from "next";
import "./globals.css"; // Ensure your CSS is imported here

export const metadata: Metadata = {
  title: "Bar & Entertainer App",
  description: "Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}