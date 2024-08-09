"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
type Article = {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};
export default function News() {
  const [news, setNews] = useState<Article[]>([]);
  const [articleNumber, setArticleNumber] = useState(3);

  useEffect(() => {
    fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/us.json")
      .then((res) => res.json())
      .then((data) => setNews(data.articles));
  }, []);

  return (
    <div className=" text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2">
      <h1 className="text-xl font-bold  px-4">Current News</h1>
      {news.slice(0, articleNumber).map((article, i) => {
        return (
          <div key={article.title} className="p-3 border-b">
            <a href={article.url} target="_blank">
              <div className=" flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-200">
                <div className=" space-y-0.5">
                  <h6 className=" text-sm font-bold ">{article.title}</h6>
                  <p className=" text-xs font-medium text-gray-500">
                    {article.source.name}
                  </p>
                </div>
                {article.urlToImage?.length && (
                  <img
                    src={article.urlToImage}
                    alt={String(i)}
                    width={70}
                    className="rounded-xl"
                  />
                )}
              </div>
            </a>
          </div>
        );
      })}
      <button
        className="text-blue-300 pl-4 pb-3 hover:text-blue-400 text-sm"
        onClick={() => setArticleNumber(articleNumber + 3)}
      >
        Load More
      </button>
    </div>
  );
}
