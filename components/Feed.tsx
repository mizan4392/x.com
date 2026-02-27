"use client";
import { app } from "@/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Post, { PostDataType } from "./Post";

export default function Feed() {
  // const db = getFirestore(app);
  // const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  // const querySnapshot = await getDocs(q);
  // let data: PostDataType[] = [];
  // querySnapshot.forEach((doc: any) => {
  //   data.push({ id: doc.id, ...doc.data() });
  // });

  const [posts, setPosts] = useState<PostDataType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore(app);
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

      const querySnapshot = await getDocs(q);

      const data: PostDataType[] = [];
      querySnapshot.forEach((doc: any) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setPosts(data);
    };

    fetchPosts();
  }, []);
  return (
    <div>
      {posts.map((post) => {
        return <Post key={post.id} post={post} id={post.id} />;
      })}
    </div>
  );
}
