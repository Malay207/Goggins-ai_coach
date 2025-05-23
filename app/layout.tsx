import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// const geistSans = localFont({
//   src: "/fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "GogginsAI-coach",
  description: "GogginsAI-Coach: Unleash Your Potential with AI-Driven Coaching",
  keywords: "GogginsAI, AI-Driven Coaching, Personal Development, Self-Impro",
  manifest:"/manifest.json",
  icons:{apple:"/images/icons/icon-192x192.png"}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
    <html lang="en">
      <head>
      </head>
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
