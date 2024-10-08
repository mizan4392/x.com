"use client";
import { modalState, postIdState } from "@/atom/modalAtom";
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
import { useRecoilState } from "recoil";

type IconProps = {
  id: string;
  uId?: string;
};
export default function Icon({ id, uId }: IconProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<any[]>([]);
  const { data: session }: any = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState<any[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    if (likes.length && session) {
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

  const deletePost = async () => {
    if (session) {
      if (window.confirm("Are you sure you want to delete this post?")) {
        if (session.user.uId === uId) {
          await deleteDoc(doc(db, "posts", id)).then(() => {
            window.location.reload();
          });
        } else {
          alert("You can't delete this post");
        }
      }
    }
  };
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <div className=" flex items-center">
        <HiOutlineChat
          onClick={() => {
            if (!session) {
              signIn();
            } else {
              setOpen(!open);
              setPostId(id);
            }
          }}
          className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
        />
        {comments.length > 0 && (
          <span className="text-xs">{comments.length}</span>
        )}
      </div>

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
      {session?.user.uId === uId && (
        <HiOutlineTrash
          onClick={deletePost}
          className="h-8 w-8 rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
        />
      )}
    </div>
  );
}
