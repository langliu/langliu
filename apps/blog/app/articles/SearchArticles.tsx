"use client";
import ArticleCard from "components/ArticleCard";
import { MagnifyingGlassIcon, NotFoundIcon } from "components/Icons";
import { Article } from "contentlayer/generated";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Pagination from "./Pagination";

export default function SearchArticles({
  articles,
}: {
  articles: Article[];
}): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const searchParams = useSearchParams();

  const filteredArticles = articles.filter((article: any) => {
    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();
    const search = searchValue.toLowerCase();

    return title.includes(search) || description.includes(search);
  });

  if (searchValue.length > 0) {
    articles = filteredArticles;
  }

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page"))
    : 1;
  const articlesPerPage = 5;
  const totalArticles = articles.length;
  const startIndex = (page - 1) * articlesPerPage;
  let endIndex = page * articlesPerPage;
  if (endIndex > totalArticles) {
    endIndex = totalArticles;
  }
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <>
      <div className="relative max-w-3xl mb-12 sm:mb-16">
        <input
          aria-label="Search articles"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search articles"
          className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-200 rounded-md dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800/90 dark:text-zinc-400"
        />

        <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300" />
      </div>
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {currentArticles.map((article: any) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
      {totalArticles === 0 && (
        <div className="grid max-w-3xl space-y-16 content-center h-[20vh]">
          <div className="text-center">
            <NotFoundIcon className="w-20 h-20 mx-auto text-gray-500 dark:text-gray-400" />
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              No articles found.
            </p>

            <p className="text-gray-500 dark:text-gray-400">
              Try searching for something else.
            </p>
          </div>
        </div>
      )}
      {totalArticles !== 0 && (
        <div className="mt-16 grid justify-items-center max-w-3xl">
          <Pagination totalArticles={totalArticles} />
        </div>
      )}
    </>
  );
}
