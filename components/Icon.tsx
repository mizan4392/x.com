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
import React, { use, useEffect, useState } from "react";
import {
  HiHeart,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
} from "react-icons/hi";

type IconProps = {
  id: string;
};
export default function Icon({ id }: IconProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<any[]>([]);
  const { data: session }: any = useSession();
  const db = getFirestore(app);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    if (likes.length) {
      setIsLiked(
        likes.findIndex((like) => like.id === session.user.uId) !== -1
      );
    }
  }, [likes]);
  const likePost = async () => {
    if (session) {
      if (isLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session.user.uId));
        setIsLiked(false);
      } else {
        await setDoc(doc(db, "posts", id, "likes", session.user.uId), {
          userName: session.user.userName,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      signIn();
    }
  };
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100" />
      <div className=" flex items-center">
        {isLiked ? (
          <HiHeart
            onClick={likePost}
            className="h-8 w-8 rounded-full text-red-600 transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        ) : (
          <HiOutlineHeart
            onClick={likePost}
            className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        )}
        {likes.length > 0 && <span className="text-xs">{likes.length}</span>}
      </div>

      <HiOutlineTrash className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100" />
    </div>
  );
}
