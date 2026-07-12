import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { blogPosts } from "@/data/blogPosts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

async function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) {
    return {
      title: "Article Not Found - ServiceHub",
    };
  }

  return {
    title: `${post.title} - ServiceHub Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <Container className="max-w-3xl space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface/60 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-black text-on-surface font-display leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-on-surface/50 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Cover Graphic */}
        <div className={`w-full aspect-video rounded-2xl ${post.imageBg} flex items-center justify-center text-9xl border border-outline-variant`}>
          {post.imageEmoji}
        </div>

        {/* Article Body */}
        <article className="prose prose-sm max-w-none text-on-surface/85 leading-relaxed space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("###")) {
              return (
                <h3 key={index} className="text-lg font-bold text-on-surface font-display mt-8 mb-3">
                  {trimmed.replace("###", "").trim()}
                </h3>
              );
            }

            if (trimmed.startsWith("-")) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-1 my-3 text-xs">
                  {trimmed.split("\n").map((li, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {li.replace("-", "").trim()}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="text-sm">
                {trimmed}
              </p>
            );
          })}
        </article>
      </Container>
    </div>
  );
}
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
