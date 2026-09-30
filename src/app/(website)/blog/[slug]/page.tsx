import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts, getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import {
  formatDate,
  imageUrl,
  readingMinutes,
  type Post,
} from "@/features/website/pages/blog/posts";
import ArticleBody from "@/features/website/pages/blog/article-body";
import { ShareBar } from "@/features/website/pages/blog/share-bar";
import { DrawnLine } from "@/features/website/pages/blog/drawn-line";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await getPostBySlug(slug);
  } catch {
    post = null;
  }

  if (!post) {
    return {
      title: "Story Not Found | Mikaelson Initiative",
      description: "The requested article could not be found.",
    };
  }

  const title = post.seoTitle || `${post.title} | Mikaelson Initiative`;
  const description = post.seoDescription || post.excerpt || "Read our story on leadership, tech, and student growth.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const ogImage = imageUrl(post.coverImage, 1200);

  return {
    title,
    description,
    authors: [{ name: post.author?.name || "Mikaelson Initiative", url: siteUrl }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Mikaelson Initiative",
      locale: "en_NG",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author?.name || "Mikaelson Initiative"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@mcdti_org",
      creator: "@mcdti_org",
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let post: Post | null = null;
  let allPosts: Post[] = [];

  try {
    [post, allPosts] = await Promise.all([getPostBySlug(slug), getAllPosts()]);
  } catch {
    post = null;
    allPosts = [];
  }

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const minutes = readingMinutes(post.body);
  const bodyText = post.body || "";

  // Other stories to explore
  const relatedPosts = allPosts.filter((p) => p.slug.current !== slug).slice(0, 2);

  return (
    <>
      {/* Schema.org Structured Data for Google News, Search and Discover */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": postUrl,
            },
            headline: post.title,
            description: post.excerpt,
            image: [imageUrl(post.coverImage, 1200)],
            datePublished: post.publishedAt,
            dateModified: post._updatedAt || post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author?.name || "Mikaelson Initiative",
              jobTitle: post.author?.role || "Contributor",
            },
            publisher: {
              "@type": "Organization",
              name: "Mikaelson Initiative",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/assets/images/mikaelsonlogo.png`,
              },
            },
          }),
        }}
      />

      <div className="bg-white pt-6 pb-24 md:pt-10 md:pb-32 dark:bg-[#050a0a]">
        <div className="mx-auto max-w-[1120px] px-4 md:px-10">
          {/* Top navigation */}
          <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5 dark:border-white/10">
            <Link
              href="/blog"
              className="-ml-2 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#003e45] transition-colors hover:bg-[#e8f7f8] dark:text-white dark:hover:bg-white/10"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              All stories
            </Link>

            <span className="text-xs font-semibold text-[#666] dark:text-white/60">
              {minutes} min read
            </span>
          </div>

          <article>
            {/* Cover image */}
            {post.coverImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#e8f7f8] sm:aspect-[16/9] lg:aspect-[21/9] dark:bg-white/5">
                <Image
                  src={imageUrl(post.coverImage, 1800)}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1120px) 1040px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
              {/* Metadata sidebar */}
              <aside className="order-2 md:order-1">
                <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:sticky md:top-28 md:flex-col">
                  {post.category ? (
                    <div>
                      <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Category</dt>
                      <dd className="mt-1.5">
                        <span className="inline-flex rounded-full bg-[#e8f7f8] px-3 py-1 text-[13px] font-semibold text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                          {post.category}
                        </span>
                      </dd>
                    </div>
                  ) : null}

                  {post.author?.name ? (
                    <div>
                      <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Written by</dt>
                      <dd className="mt-1.5">
                        <p className="font-semibold text-[#111] dark:text-white">{post.author.name}</p>
                        {post.author.role ? (
                          <p className="text-xs text-[#666] dark:text-white/50">{post.author.role}</p>
                        ) : null}
                      </dd>
                    </div>
                  ) : null}

                  {post.publishedAt ? (
                    <div>
                      <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Published</dt>
                      <dd className="mt-1.5 font-medium text-[#111] dark:text-white">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "long")}</time>
                      </dd>
                    </div>
                  ) : null}

                  <div>
                    <dt className="text-[13px] font-semibold text-[#555] dark:text-white/60">Reading time</dt>
                    <dd className="mt-1.5 font-medium text-[#111] dark:text-white">{minutes} min</dd>
                  </div>
                </dl>
              </aside>

              {/* Main content */}
              <div className="order-1 min-w-0 md:order-2">
                <h1 className="max-w-[22ch] text-[2.25rem] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#003e45] md:text-[3.5rem] dark:text-white">
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="mt-6 max-w-[60ch] text-[1.1875rem] leading-relaxed text-[#555] md:text-[1.3125rem] dark:text-white/60">
                    {post.excerpt}
                  </p>
                ) : null}

                <DrawnLine variant="path" className="mt-8 mb-10 h-6 w-40" />

                <ArticleBody body={bodyText} />

                {/* Social Share Bar */}
                <div className="mt-12 border-y border-black/10 py-6 dark:border-white/10">
                  <ShareBar title={post.title} slug={slug} excerpt={post.excerpt} />
                </div>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-20 md:ml-[calc(200px+3rem)] lg:ml-[calc(240px+3rem)]">
              <div className="rounded-3xl bg-[#eefcfc] p-6 md:p-10 dark:bg-white/5">
                <p className="max-w-[40ch] text-[1.375rem] leading-snug font-semibold text-[#003e45] md:text-[1.625rem] dark:text-white">
                  Stories like this start with a student who decides to grow, and the people who walk beside them.
                </p>
                <p className="mt-4 max-w-[52ch] text-base leading-[1.7] text-[#555] dark:text-white/60">
                  You can be one of those people.{" "}
                  <Link
                    href="/volunteer"
                    className="font-semibold text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] dark:text-[#5ce1e6]"
                  >
                    Volunteer your time
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/sponsor"
                    className="font-semibold text-[#003e45] underline decoration-[#5ce1e6] decoration-2 underline-offset-[3px] dark:text-[#5ce1e6]"
                  >
                    sponsor a programme
                  </Link>
                  .
                </p>
              </div>

              {/* Related stories */}
              {relatedPosts.length > 0 ? (
                <div className="mt-14 border-t border-black/10 pt-10 dark:border-white/10">
                  <h2 className="text-xl font-bold text-[#003e45] dark:text-white">More stories to explore</h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related._id}
                        href={`/blog/${related.slug.current}`}
                        className="group flex flex-col rounded-2xl border border-black/10 p-5 transition-colors hover:border-[#5ce1e6] dark:border-white/10 dark:hover:border-[#5ce1e6]"
                      >
                        {related.category ? (
                          <span className="text-xs font-semibold text-[#003e45] dark:text-[#5ce1e6]">
                            {related.category}
                          </span>
                        ) : null}
                        <span className="mt-2 text-base font-bold text-[#111] group-hover:text-[#003e45] dark:text-white dark:group-hover:text-[#5ce1e6]">
                          {related.title}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-[#003e45] dark:text-[#5ce1e6]">
                          Read story
                          <ArrowRight size={13} aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-10">
                <Link
                  href="/blog"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#003e45]/25 px-6 text-sm font-semibold text-[#003e45] transition-colors hover:border-[#003e45] dark:border-white/25 dark:text-white dark:hover:border-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back to all stories
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
