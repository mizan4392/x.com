import { app } from "@/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import React from "react";
import Post, { PostDataType } from "./Post";

export default async function Feed() {
  const db = getFirestore(app);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  let data: PostDataType[] = [];
  querySnapshot.forEach((doc: any) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return (
    <div>
      {data.map((post) => {
        return <Post key={post.id} post={post} id={post.id} />;
      })}
    </div>
  );
}
