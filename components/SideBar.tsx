"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { HiHome, HiDotsHorizontal } from "react-icons/hi";

export default function SideBar() {
  const { data: session }: any = useSession();

  return (
    <div>
      <div className=" flex flex-col gap-4 p-3">
        <Link href={"/"}>
          <FaXTwitter className="w-16 h-16 p-3 hover:bg-gray-100 rounded-full transition-all duration-200 " />
        </Link>
        <Link
          href={"/"}
          className=" flex items-center p-3 hover:bg-gray-100 rounded-full transition-all duration-200 gap-2 w-fit"
        >
          <HiHome className="w-7 h-7  " />
          <span className=" font-bold hidden xl:inline">Home</span>
        </Link>
        {session && (
          <div className=" text-gray-700 text-sm flex items-center cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-all duration-200">
            <img
              className=" h-10 w-10 rounded-full xl:mr-2 "
              src={session.user?.image}
              alt="userImage"
            />
            <div className="hidden xl:inline">
              <h4 className="font-bold">{session.user?.name}</h4>
              <p className="text-gray-500">@{session.user?.userName || ""}</p>
            </div>
            <HiDotsHorizontal className="h-5 xl:ml-8 hidden xl:inline" />
          </div>
        )}
        <button
          onClick={() => (session ? signOut() : signIn())}
          className=" bg-blue-400 rounded-full text-white hover:brightness-95 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline"
        >
          {session ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
