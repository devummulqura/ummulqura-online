import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Share2,
  Clock3,
} from "lucide-react";

import connectToDatabase from "@/lib/db";
import News from "@/models/News";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectToDatabase();

  const { slug } = await params;

  const article = await News.findOne({ slug });

  if (!article) {
    return {
      title: "Article Not Found | Ummul",
    };
  }

  return {
    title: `${article.title} | Ummul News`,
    description:
      article.summary ||
      article.subtitle ||
      "Read the latest news from Ummul Institute.",
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectToDatabase();

  const { slug } = await params;

  const article = await News.findOne({ slug });

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-36 pb-16 overflow-hidden">

        {/* Background */}
        {article.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover scale-105 blur-sm"
            />
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 max-w-5xl">

          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          {/* Category */}
          <div className="inline-flex items-center rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-primary text-sm font-semibold backdrop-blur-md mb-6">
            {article.category}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white font-heading max-w-4xl">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-lg md:text-xl text-white/70 mt-6 max-w-3xl leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mt-8 text-white/70 text-sm">

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(article.date), "MMMM dd, yyyy")}
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              5 min read
            </div>

            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-10 z-20 mb-10">
        <div className="container mx-auto px-4 max-w-5xl">

          <article className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-border shadow-2xl overflow-hidden">

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="p-5 md:p-8">
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-[260px] md:h-[520px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {article.caption && (
                  <p className="text-center text-sm text-muted-foreground mt-4 italic">
                    {article.caption}
                  </p>
                )}
              </div>
            )}

            {/* Article Body */}
            <div className="px-6 md:px-14 pb-14">

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Tags</span>
                  </div>

                  {article.tags.map(
                    (tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Content */}
              <div
                className="
                  max-w-3xl mx-auto
                  text-[17px] md:text-[18px]
                  leading-8 md:leading-9
                  text-zinc-700 dark:text-zinc-300
                  break-words
                  
                  [&_img]:max-w-full
                  [&_img]:h-auto
                  [&_img]:rounded-2xl
                  [&_img]:my-8
                  
                  [&_iframe]:w-full
                  [&_iframe]:rounded-2xl
                  [&_iframe]:overflow-hidden
                  
                  [&_p]:mb-7
                  [&_p]:leading-8
                  
                  [&_h1]:text-4xl
                  [&_h1]:font-bold
                  [&_h1]:mt-12
                  [&_h1]:mb-6
                  [&_h1]:text-zinc-900
                  dark:[&_h1]:text-white
                  
                  [&_h2]:text-3xl
                  [&_h2]:font-bold
                  [&_h2]:mt-12
                  [&_h2]:mb-5
                  [&_h2]:text-zinc-900
                  dark:[&_h2]:text-white
                  
                  [&_h3]:text-2xl
                  [&_h3]:font-semibold
                  [&_h3]:mt-10
                  [&_h3]:mb-4
                  [&_h3]:text-zinc-900
                  dark:[&_h3]:text-white
                  
                  [&_ul]:list-disc
                  [&_ul]:pl-6
                  [&_ul]:mb-7
                  
                  [&_ol]:list-decimal
                  [&_ol]:pl-6
                  [&_ol]:mb-7
                  
                  [&_li]:mb-3
                  
                  [&_blockquote]:border-l-4
                  [&_blockquote]:border-primary
                  [&_blockquote]:bg-zinc-100
                  dark:[&_blockquote]:bg-zinc-900
                  [&_blockquote]:rounded-r-2xl
                  [&_blockquote]:px-6
                  [&_blockquote]:py-5
                  [&_blockquote]:my-8
                  [&_blockquote]:italic
                  
                  [&_a]:text-primary
                  [&_a]:underline
                  [&_a]:underline-offset-4
                  hover:[&_a]:text-primary/80
                  
                  [&_table]:w-full
                  [&_table]:overflow-x-auto
                  [&_table]:block
                  
                  [&_pre]:overflow-x-auto
                  [&_pre]:rounded-2xl
                  [&_pre]:p-4
                  [&_pre]:bg-zinc-950
                  [&_pre]:text-white
                "
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}