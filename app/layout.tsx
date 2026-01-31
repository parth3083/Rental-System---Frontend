import { Inter } from "next/font/google"; // simplified font usage
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: any = {
  title: "Rental Management System",
  description: "Modern Rental solution for vendors and customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
