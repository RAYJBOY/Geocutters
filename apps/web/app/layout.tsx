import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { NavBarLink } from "@/types/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NavBarLinks: NavBarLink[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Find Hairdresser",
    link: "/findHairdresser",
  },
  {
    name: "Contact Us",
    link: "contact-us",
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <NavBar links={NavBarLinks} />
        {children}
      </body>
    </html>
  );
}
