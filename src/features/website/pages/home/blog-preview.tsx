import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import type { Post } from "@/features/website/pages/blog/posts";
import { Reveal } from "@/components/site/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/site/motion/stagger";
import styles from "./home.module.css";

const ECOSYSTEM_STORIES: { name: string; category: string | null; soon: string }[] = [
  { name: "Mikaelson School Club", category: "communities", soon: "Stories from our school clubs are on the way." },
  { name: "Mikaelson Labs", category: "innovation", soon: "Stories from the Labs are on the way." },
  { name: "Partnership & Growth Network", category: "leadership", soon: "Stories from the network are on the way." },
  { name: "Mikaelson Institute", category: null, soon: "Stories from the Institute are coming soon." },
];

// Stories link directly to their dedicated article pages.
const storyHref = (post: Post) => `/blog/${encodeURIComponent(post.slug.current)}`;

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function BlogPreview() {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }

  // Latest post per mapped category, or fall back to any available published posts so newly published stories are immediately visible
  const usedSlugs = new Set<string>();
  const latest = ECOSYSTEM_STORIES.map((eco) => {
    let post = eco.category
      ? posts.find(
          (p) =>
            !usedSlugs.has(p.slug.current) &&
            p.category?.trim().toLowerCase().startsWith(eco.category as string)
        )
      : undefined;

    if (!post) {
      post = posts.find((p) => !usedSlugs.has(p.slug.current));
    }

    if (post) {
      usedSlugs.add(post.slug.current);
    }

    return {
      ...eco,
      post,
    };
  });

  return (
    <section className="bg-white py-24 md:py-32 dark:bg-[#0a0f0f]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
        <div className="pl-8 lg:pl-24">
          <Reveal className="grid gap-6 lg:grid-cols-12">
            <h2 data-stop className="text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-[#003e45] sm:text-[40px] lg:col-span-6 dark:text-white">
              Our latest stories
            </h2>
            <p className="max-w-[34rem] text-[16px] leading-[1.7] text-[#555] sm:text-[18px] lg:col-span-5 lg:col-start-8 dark:text-white/65">
              One from each part of what we do: the clubs, the Labs, the network and the Institute.
            </p>
          </Reveal>

          <StaggerGroup onViewport staggerChildren={0.06} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map(({ name, post, soon }) => (
              <StaggerItem key={name} className="h-full">
                {post ? (
                  <Link
                    href={storyHref(post)}
                    className={`${styles.card} ${styles.press} group flex h-full flex-col rounded-2xl border border-black/10 p-6 hover:border-[#5ce1e6] dark:border-white/10 dark:hover:border-[#5ce1e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097a7]`}
                  >
                    <span className="text-[13px] font-semibold text-[#003e45] dark:text-[#5ce1e6]">{name}</span>
                    <span className="mt-4 block text-[19px] leading-[1.3] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">
                      {post.title}
                    </span>
                    {post.excerpt && (
                      <span className="mt-3 line-clamp-4 block text-[15px] leading-[1.65] text-[#555] dark:text-white/60">
                        {post.excerpt}
                      </span>
                    )}
                    <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-[13px] text-[#555] dark:text-white/50">
                      {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : <span />}
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#003e45] dark:text-[#5ce1e6]">
                        Read the story
                        <ArrowRight aria-hidden="true" size={15} className={styles.arrow} />
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col rounded-2xl border border-dashed border-black/15 p-6 dark:border-white/15">
                    <span className="text-[13px] font-semibold text-[#003e45] dark:text-[#5ce1e6]">{name}</span>
                    <span className="mt-4 block text-[19px] leading-[1.3] font-semibold tracking-[-0.01em] text-[#111] dark:text-white">
                      Coming soon
                    </span>
                    <span className="mt-3 block text-[15px] leading-[1.65] text-[#555] dark:text-white/60">{soon}</span>
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-14">
            <Link
              href="/blog"
              className={`${styles.press} inline-flex min-h-11 items-center rounded-full bg-[#003e45] px-6 text-[15px] font-semibold text-white hover:bg-[#002b30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6] dark:bg-[#5ce1e6] dark:text-black dark:hover:bg-[#4bcdd2]`}
            >
              Read all our stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
