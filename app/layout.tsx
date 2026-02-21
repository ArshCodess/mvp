import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import UserProvider from "@/hooks/UserProvider";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evently: Your Campus Event Companion",
  description: "Discover, register, and manage campus events effortlessly with Evently. Your ultimate companion for staying connected and engaged in campus life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} md:flex ${geistMono.variable} antialiased  md:mx-20 md:justify-center md:space-x-15`}
          >
            <Sidebar/>
            <div className="p-4 absolute z-10 top-4 right-4"><UserButton /></div>
            {children}
            <div className="bg-blue-400">Notifications</div>
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}
