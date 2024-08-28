"use client";
import { app } from "@/firebase";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";

type CommentsProps = {
  id: string;
};
export default function Comments({ id }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const db = getFirestore(app);
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [id, db]);
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment.data()} id={comment.id} />
      ))}
    </div>
  );
}
