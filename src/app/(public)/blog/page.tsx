"use client";

import { Container } from "@/components/layout/Container";
import { blogPosts } from "@/data/blogPosts";
import Link from "next/link";
import { Calendar, Clock, BookOpen } from "lucide-react";

export default function BlogIndexPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-on-surface font-display">ServiceHub Insights</h1>
          <p className="text-sm text-on-surface/65">
            Tips, guides, and articles to help you choose the right service providers and grow your independent business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group bg-surface border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            >
              {/* Cover emoji */}
              <div className={`aspect-video w-full ${post.imageBg} flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300`}>
                {post.imageEmoji}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-center gap-4 text-[10px] text-on-surface/50 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-on-surface text-base group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-on-surface/70 line-clamp-3 leading-relaxed mt-1">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-outline-variant/65 flex justify-between items-center">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
