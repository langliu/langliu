import { Container } from "components/Container";
import { server } from "config";
import { allArticles, Article } from "contentlayer/generated";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "./ArticlePage";

// This is the function that Next.js will call to generate the static pages
export async function generateStaticParams(): Promise<any> {
  const articles = await allArticles;

  return articles.map((article: Article) => ({ slug: article.slug }));
}

// Get the article data for the given slug
function getArticle(slug: string, articles: Article[]): Article | undefined {
  return articles.find((a: Article) => a.slug === slug);
}

// Dynamic metadata for the article page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug, await allArticles);
  return {
    title: article?.title,
    description: article?.description,
    keywords: [
      article?.tags?.map((tag) => tag.title).join(", "),
      article?.categories?.map((category) => category.title).join(", "),
    ],

    // Open Graph
    openGraph: {
      type: "article",
      title: article?.title,
      publishedTime: article?.publishedAt,
      authors: [article?.author?.name],
      description: article?.description,
      url: `${server}/articles/${params.slug}`,
      siteName: "Mir Sazzat Hossain - Innovative Researcher and Skilled Mentor",
      images: [
        {
          url: `${server}/images/${article?.covers[0].url}`,
          width: 1200,
          height: 630,
          alt: article?.title,
        },
      ],
      locals: ["en_US"],
    },

    // Twitter
    twitter: {
      cardType: "summary_large_image",
      title: article?.title,
      description: article?.description,
      images: [
        {
          url: `${server}/images/${article?.covers[0].url}`,
          width: 1200,
          height: 630,
          alt: article?.title,
        },
      ],
      site: "@mir_sazzat",
      creator: "@mir_sazzat",
    },

    // Alternates
    alternates: {
      canonical: `${server}/articles/${params.slug}`,
      types: {
        "application/rss+xml": `${server}/feed.xml`,
      },
    },
  };
}

// Get sorted articles from the contentlayer
async function getSortedArticles(): Promise<Article[]> {
  let articles = await allArticles;

  articles = articles.filter(
    (article: Article) => article.status === "published"
  );

  return articles.sort((a: Article, b: Article) => {
    if (a.publishedAt && b.publishedAt) {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return 0;
  });
}

// return the next and previous articles
function getNextandPrevArticles(
  article: Article,
  articles: Article[]
): { previousArticle: Article | undefined; nextArticle: Article | undefined } {
  let previousArticle: Article | undefined;
  let nextArticle: Article | undefined;

  // if the article is part of a series,
  //get the next and previous articles from the series
  if (article.series) {
    const seriesArticles = articles.filter(
      (a: Article) => a.series?.title === article.series?.title
    );

    const sortedSeriesArticles = seriesArticles.sort(
      (a: Article, b: Article) => {
        if (a.series?.order && b.series?.order) {
          return a.series?.order - b.series?.order;
        }
        return 0;
      }
    );

    const currentArticleIndex = sortedSeriesArticles.findIndex(
      (a: Article) => a.slug === article.slug
    );
    if (currentArticleIndex > 0) {
      previousArticle = sortedSeriesArticles[currentArticleIndex - 1];
    }
    if (currentArticleIndex < sortedSeriesArticles.length - 1) {
      nextArticle = sortedSeriesArticles[currentArticleIndex + 1];
    }
  }

  // if the article is not part of a series,
  //get the next and previous articles from the articles list
  if (!previousArticle) {
    const currentArticleIndex = articles.findIndex(
      (a: Article) => a.slug === article.slug
    );
    if (currentArticleIndex > 0) {
      previousArticle = articles[currentArticleIndex - 1];
    }
  }

  if (!nextArticle) {
    const currentArticleIndex = articles.findIndex(
      (a: Article) => a.slug === article.slug
    );
    if (currentArticleIndex < articles.length - 1) {
      nextArticle = articles[currentArticleIndex + 1];
    }
  }

  return { previousArticle, nextArticle };
}

// get related articles
function getRelatedArticles(article: Article, articles: Article[]): Article[] {
  return articles
    .filter((a: Article) => {
      if (a.slug === article.slug) return false;
      if (a.categories.some((c) => article.categories.includes(c))) return true;
      if (a.tags?.some((t) => article.tags?.includes(t))) return true;
      if (a.series?.title === article.series?.title) return true;
      return false;
    })
    .slice(0, 2);
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const { slug } = params;
  let articles = await getSortedArticles();
  let article = getArticle(slug, articles);

  if (!article) return notFound();

  const { previousArticle, nextArticle } = getNextandPrevArticles(
    article,
    articles
  );
  const relatedArticles = getRelatedArticles(article, articles);

  return (
    <Container className="mt-16 lg:mt-32">
      <ArticlePage
        article={article}
        previousArticle={previousArticle}
        nextArticle={nextArticle}
        relatedArticles={relatedArticles}
      />
    </Container>
  );
}
