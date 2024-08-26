import Link from "next/link";
import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Icon from "./Icon";

export type PostDataType = {
  id: string;
  uid?: string | null;
  userName?: string | null;
  text: string;
  image?: string | null;
  timestamp: string;
  profileImage?: string | null;
  name?: string;
};
type PostProps = {
  post: PostDataType;
  id: string;
};
export default function Post({ post }: PostProps) {
  return (
    <div className=" flex p-3 border-b border-gray-200 hover:bg-gray-50">
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post.profileImage}
        alt="user-image"
      />
      <div className=" flex-1">
        <div className=" flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap ">
            <h4 className="font-bold text-sx truncate">{post.name}</h4>
            <span className="text-xs truncate">@{post.userName}</span>
          </div>
          <HiDotsHorizontal className="text-sm" />
        </div>
        <Link href={`/post/${post.id}`}>
          <p className="text-gray-800 text-sm my-3">{post.text}</p>
        </Link>
        {post.image && (
          <Link href={`/post/${post.id}`}>
            <img
              src={post.image}
              alt="post-image"
              className=" rounded-2xl mr-2"
            />
          </Link>
        )}
        <Icon />
      </div>
    </div>
  );
}
