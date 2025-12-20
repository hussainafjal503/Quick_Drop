import type { Metadata } from "next";
import "./globals.css";
import Provider from "../Provider/Provider";

export const metadata: Metadata = {
  title: "Quick Drop | Your Time",
  description: "Get you product within time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-linear-to-b from-orange-100 to-white w-full min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
