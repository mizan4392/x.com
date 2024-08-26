"use client";
import { app } from "@/firebase";
import { time } from "console";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function Input() {
  const { data: session }: any = useSession();
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageUploading, setImageUploading] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const db = getFirestore(app);
  useEffect(() => {
    if (selectedImage) {
      handelUploadImageToServer();
    }
  }, [selectedImage]);

  const handelUploadImageToServer = async () => {
    if (!selectedImage) return;
    setImageUploading(true);
    const store = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedImage?.name;
    const storageRef = ref(store, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        setImageUploading(false);
        setSelectedImage(null);
        setImageUrl("");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUploading(false);

          setImageUrl(downloadURL);
        });
      }
    );
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    setLoading(true);
    console.log(session);
    const docRef = await addDoc(collection(db, "posts"), {
      uid: session?.user?.uId,
      userName: session?.user?.userName,
      text: text,
      image: imageUrl,
      timestamp: serverTimestamp(),
      profileImage: session?.user?.image,
    });
    setLoading(false);
    setText("");
    setImageUrl("");
    setSelectedImage(null);
  };
  if (!session) return null;
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={session.user?.image || ``}
        alt="userImage"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-50"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          placeholder="Whats happening"
          rows={2}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {selectedImage && (
          <img
            src={imageUrl}
            alt="uplodedImage"
            className={`w-full max-h-[250px] object-cover cursor-pointer ${
              imageUploading && "animate-pulse"
            }`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => inputRef?.current?.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            disabled={text.trim() === "" || loading || imageUploading}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
