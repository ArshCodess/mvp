"use client"
import { UserButton } from "@clerk/nextjs";
import { CalendarRangeIcon, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkBase =
    "flex flex-col items-center text-xs gap-0.5 transition-transform transition-opacity duration-200 ease-in-out";

  return (
    <div className="fixed bottom-0 pb-1 bg-linear-180 from-transparent pt-3 to-25% lg:hidden to-white flex justify-center w-full ">
      <div className="list-none justify-between px-8 bg-gradient-to-br  text-gray-200 from-indigo-500 items-center border-gray-300 border to-pink-500  flex  rounded-4xl py-2 w-[80vw]">
        <Link
          className={`${linkBase} ${
            isActive("/applied") ? "" : "scale-75 opacity-70"
          }`}
          href="/applied"
        >
          <Heart />
          Applied
        </Link>
        <Link
          className={`${linkBase} ${
            isActive("/events") ? "" : "scale-75 opacity-70"
          }`}
          href="/events"
        >
          <CalendarRangeIcon />
          Events
        </Link>
        <Link
          className={`${linkBase} ${
            isActive("/profile") ? "" : "scale-75 opacity-70"
          }`}
          href="/profile"
        >
          <UserButton />
          Profile
        </Link>
      </div>
    </div>
  );
}
