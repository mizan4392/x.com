import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import News from "@/components/News";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X Clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" flex justify-between max-w-6xl mx-auto">
          <div className=" hidden sm:inline border-r h-screen">
            <SideBar />
          </div>
          <div> {children}</div>
          <div>
            <News />
          </div>
        </div>
      </body>
    </html>
  );
}
