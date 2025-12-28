import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Meta Generate",
  description: "Frontend and API for generating video metadata."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
