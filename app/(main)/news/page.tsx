"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.success) {
          setNews(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">News & Events</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stay updated with the latest happenings, announcements, and events at Ummul Institute.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse glass-card rounded-2xl h-[400px]">
              <div className="bg-gray-200 dark:bg-zinc-800 h-48 rounded-t-2xl"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No news articles found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-primary/10">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-4xl text-primary/20">Ummul</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(item.date), 'MMMM dd, yyyy')}</span>
                </div>
                <h2 className="text-xl font-bold font-heading text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <div 
                  className="text-muted-foreground line-clamp-3 mb-6 flex-grow [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: item.summary || item.content }}
                />
                <div className="mt-auto">
                  <Link href={`/news/${item.slug}`}>
                    <Button variant="ghost" className="p-0 text-primary hover:bg-transparent hover:text-accent flex items-center gap-1 group/btn">
                      Read Article
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
