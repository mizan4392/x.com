"use client";
import { app } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { HiDotsHorizontal, HiHeart, HiOutlineHeart } from "react-icons/hi";
type CommentProps = {
  comment: any;
  commentId: string;
  postId: string;
};
export default function Comment({ comment, commentId, postId }: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<any[]>([]);
  const { data: session }: any = useSession();
  const db = getFirestore(app);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments", commentId, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
  }, [db]);

  useEffect(() => {
    if (likes.length && session) {
      setIsLiked(
        likes.findIndex((like) => like.id === session.user.uId) !== -1
      );
    }
  }, [likes]);

  const likeComment = async () => {
    if (session) {
      if (isLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            postId,
            "comments",
            commentId,
            "likes",
            session.user.uId
          )
        );
        setIsLiked(false);
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            postId,
            "comments",
            commentId,
            "likes",
            session.user.uId
          ),
          {
            userName: session.user.userName,
            timestamp: serverTimestamp(),
          }
        );
      }
    } else {
      signIn();
    }
  };
  return (
    <div className=" flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10">
      <img
        className="h-9 w-9 rounded-full mr-4"
        src={comment.profileImage || ""}
        alt="user-image"
      />
      <div className=" flex-1">
        <div className=" flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap ">
            <h4 className="font-bold text-sm truncate">{comment.name}</h4>
            <span className="text-xs truncate">@{comment.userName}</span>
          </div>
          <HiDotsHorizontal className="text-sm" />
        </div>
        <p className="text-gray-800 text-xs my-3">{comment?.comment}</p>
        <div className="flex items-center">
          {isLiked ? (
            <HiHeart
              onClick={likeComment}
              className="h-8 w-8 rounded-full text-red-600 transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
            />
          ) : (
            <HiOutlineHeart
              onClick={likeComment}
              className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
            />
          )}
          {likes.length > 0 && <span className="text-xs">{likes.length}</span>}
        </div>
      </div>
    </div>
  );
}
