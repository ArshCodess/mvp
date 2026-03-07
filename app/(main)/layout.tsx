import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import UserProvider from "@/hooks/UserProvider";
import Sidebar from "@/components/Sidebar";
import AnnouncementCard from "@/components/AnnouncementCard";
import Notifications from "@/components/Notifications";
import Link from "next/link";
import { CalendarRangeIcon, Heart } from "lucide-react";
import MobileNav from "@/components/MobileNav";

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
        <main
          className={`${geistSans.variable} ${geistMono.variable} antialiased  md:mx-2 lg:mx-3 xl:mx-4`}
        >
          <div className="md:flex  md:gap-4 w-full">
            <Sidebar />
            {children}
            {/* <Notifications /> */}
          </div>
          <MobileNav/>
        </main>
      </UserProvider>
    </ClerkProvider>
  );
}
